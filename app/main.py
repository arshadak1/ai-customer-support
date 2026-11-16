from fastapi import FastAPI

app = FastAPI(title="AI customer support")

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
