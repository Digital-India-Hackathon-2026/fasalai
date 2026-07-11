# FasalAI

Farmer capability assessment with a trained XGBoost tier-prediction model.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install the project-contained XGBoost build. It runs without Homebrew or the
macOS OpenMP runtime:

```bash
CMAKE_BIN="$(python -c 'import cmake; from pathlib import Path; print(Path(cmake.__file__).parent / "data/bin")')"
PATH="$CMAKE_BIN:$PWD/.venv/bin:$PATH" pip install --no-binary=xgboost --no-cache-dir \
  --config-settings use_openmp=false xgboost==3.3.0
python3 app.py
```

Open `http://127.0.0.1:5000`. The dashboard sends the completed assessment to
`POST /api/predict`, which loads the saved model and encoders from `models/`.

Do not open `dashboard.html` directly or use a static-file server: the score
needs the Flask API running at the same address. The service health check is
available at `http://127.0.0.1:5000/health`.

## Important model limitation

This project is a prototype. The supplied training data assigns the target tier
from `final_capability_score`, and that score is also supplied to the model as a
feature. As a result, the perfect held-out accuracy measures how well the model
recreates those score rules; it does **not** prove loan repayment or credit-risk
accuracy. Do not use it for lending decisions without retraining and validating
on consented, real-world outcomes (for example, repayment/default records) and
an independent test set.

## Security note

The login accounts are demo-only and are stored in browser session storage.
Replace them with server-side authentication, encrypted document storage, and
authorization controls before publishing the application.
