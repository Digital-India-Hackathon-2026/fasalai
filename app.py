"""FasalAI inference API for the trained XGBoost farmer-tier model."""

import math
import os
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, abort, jsonify, request, send_from_directory
from werkzeug.exceptions import BadRequest


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
MODEL = joblib.load(MODEL_DIR / "fasalai_xgb_model.joblib")
LABEL_ENCODERS = joblib.load(MODEL_DIR / "fasalai_label_encoders.joblib")
TARGET_ENCODER = joblib.load(MODEL_DIR / "fasalai_target_encoder.joblib")

app = Flask(__name__)

# Only browser assets are public.  In particular, the trained model and encoder
# files must never be downloadable through the generic static-file route.
PUBLIC_FILES = {
    "index.html",
    "login.html",
    "dashboard.html",
    "style.css",
    "landing.js",
    "login.js",
    "dashboard.js",
    "i18n.js",
    "farmer.png",
}


def as_number(payload, field, integer=False):
    try:
        value = float(payload[field])
        if not math.isfinite(value):
            raise ValueError
        if integer and not value.is_integer():
            raise ValueError
        return int(value) if integer else value
    except (KeyError, TypeError, ValueError):
        raise ValueError(f"{field} must be a valid number.")


def bounded_number(payload, field, minimum, maximum, integer=False):
    value = as_number(payload, field, integer=integer)
    if not minimum <= value <= maximum:
        raise ValueError(f"{field} must be between {minimum} and {maximum}.")
    return value


def as_bool(payload, field):
    value = payload.get(field)
    if isinstance(value, bool):
        return int(value)
    raise ValueError(f"{field} must be true or false.")


def normalise_value(field, value):
    aliases = {
        "land_ownership_status": {"tenant": "lease", "lease taker / tenant": "lease"},
        "crop_duration": {
            "short duration (3–4 months)": "Short Duration (3-4 Months)",
            "medium duration (5–6 months)": "Medium Duration (5-6 Months)",
            "long duration (7–9 months)": "Long Duration (7-9 Months)",
        },
        "primary_crop": {"paddy": "Paddy/Rice", "paddy/rice": "Paddy/Rice"},
        "irrigation_method": {
            "canal / borewell": "Canal",
            "canal": "Canal",
            "micro": "Micro-irrigation",
            "micro-irrigation": "Micro-irrigation",
            "rainfed": "Rainfed",
        },
    }
    value = str(value).strip()
    return aliases.get(field, {}).get(value.lower(), value)


def build_features(payload):
    if not isinstance(payload, dict):
        raise ValueError("A JSON object is required.")

    age = bounded_number(payload, "age", 18, 100, integer=True)
    experience = bounded_number(payload, "farming_experience_years", 0, 70, integer=True)
    land_size = bounded_number(payload, "land_holding_acres", 0.1, 10000)
    agronomy = bounded_number(payload, "agronomy_skill_score", 0, 100)
    business = bounded_number(payload, "business_skill_score", 0, 100)
    machinery = bounded_number(payload, "machinery_skill_score", 0, 100)
    investment = bounded_number(payload, "past_crop_investment_rs", 0, 1_000_000_000)
    profit = bounded_number(payload, "past_crop_profit_rs", 0, 1_000_000_000)
    loss_amount = bounded_number(payload, "loss_amount_rs", 0, 1_000_000_000)
    certificates = bounded_number(payload, "certificates_count", 0, 20, integer=True)

    skill_score = min(100, round(
        agronomy
        + business
        + machinery
        + min(experience, 15)
        + min(land_size * 2, 10)
        + {"Micro-irrigation": 8, "Canal": 5}.get(normalise_value("irrigation_method", payload["irrigation_method"]), 2)
        + (5 if as_bool(payload, "active_crop_insurance") else 0)
    ))
    features = {
        "age": age,
        "state": payload["state"],
        "farming_experience_years": experience,
        "land_ownership_status": payload["land_ownership_status"],
        "crop_duration": payload["crop_duration"],
        "primary_crop": payload["primary_crop"],
        "land_holding_acres": land_size,
        "irrigation_method": payload["irrigation_method"],
        "agronomy_skill_score": agronomy,
        "business_skill_score": business,
        "machinery_skill_score": machinery,
        "past_crop_investment_rs": investment,
        "past_crop_profit_rs": profit,
        "suffered_loss": as_bool(payload, "suffered_loss"),
        "loss_amount_rs": loss_amount,
        "active_crop_insurance": as_bool(payload, "active_crop_insurance"),
        "certificates_count": certificates,
        "certificate_bonus": 5 if certificates else 0,
        "sales_receipts_uploaded": as_bool(payload, "sales_receipts_uploaded"),
        "final_capability_score": skill_score,
    }
    for field, encoder in LABEL_ENCODERS.items():
        value = normalise_value(field, features[field])
        if value not in encoder.classes_:
            raise ValueError(f"Unsupported {field.replace('_', ' ')}: {value}.")
        features[field] = encoder.transform([value])[0]
    return pd.DataFrame([features], columns=MODEL.feature_names_in_), skill_score


@app.post("/api/predict")
def predict():
    try:
        payload = request.get_json(silent=False)
        features, score = build_features(payload)
        probabilities = MODEL.predict_proba(features)[0]
        prediction = int(probabilities.argmax())
        tier = TARGET_ENCODER.inverse_transform([prediction])[0]
        confidence = round(float(probabilities[prediction]) * 100, 1)
        risk = {"Tier 1: Master Farmer": "Low", "Tier 2: Capable Farmer": "Medium"}.get(tier, "High")
        return jsonify({"tier": tier, "risk": risk, "confidence": confidence, "capability_score": score})
    except (BadRequest, ValueError, KeyError) as error:
        return jsonify({"error": str(error)}), 400


@app.get("/")
def dashboard():
    return send_from_directory(BASE_DIR, "dashboard.html")


@app.get("/health")
def health():
    """Lightweight health check for local deployment verification."""
    return jsonify({"status": "ok"})


@app.get("/<path:filename>")
def static_files(filename):
    if filename not in PUBLIC_FILES:
        abort(404)
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=os.getenv("FLASK_DEBUG") == "1")
