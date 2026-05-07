from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="UBID AI Sync Platform",
    description="AI-Augmented Government Interoperability Intelligence Layer",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from models import Event
from services import detect_conflict, resolve_conflict
from services import trust_scores


@app.get("/")
def home():
    return {"message": "Backend running"}

from services import route_event, translate_event, send_to_target, log_event

@app.post("/sws/event")
def sws_event(event: Event):

    # 🔥 check conflict
    prev_event, time_diff = detect_conflict(event)

    if prev_event:
        print("⚠️ Conflict detected!")

        winner = resolve_conflict(event, prev_event, time_diff)
        print("Winner:", winner.source_system)

        chosen_event = winner
    else:
        chosen_event = event

    # continue normal flow
    targets = route_event(chosen_event.ubid)

    for target in targets:
        translated = translate_event(chosen_event, target)
        status = send_to_target(target, translated)

        log_event(
            ubid=chosen_event.ubid,
            source=chosen_event.source_system,
            target=target,
            status=status,
            payload=translated
        )

    return {"status": "processed"}

@app.post("/dept/event")
def dept_event(event: Event):

    prev_event, time_diff = detect_conflict(event)

    if prev_event:

        winner, explanation = resolve_conflict(
            event,
            prev_event,
            time_diff
        )

        print("⚠️ Conflict detected!")
        print("Winner:", explanation["winner"])
        print("Confidence:", explanation["confidence"])

        chosen_event = winner

    else:

        explanation = None
        chosen_event = event

    targets = route_event(chosen_event.ubid)

    for target in targets:

        translated = translate_event(
            chosen_event,
            target
        )

        status = send_to_target(
            target,
            translated
        )

        log_event(

            ubid=chosen_event.ubid,

            source=chosen_event.source_system,

            target=target,

            status=status,

            payload={

                "translated": translated,

                "ai_explanation": explanation

            }

        )

    return {
        "status": "processed"
    }

@app.post("/factories/update")
def factories_update(data: dict):
    print("Factories received:", data)
    return {"status": "ok"}


@app.post("/shop/update")
def shop_update(data: dict):
    print("Shop received:", data)
    return {"status": "ok"}

from services import audit_logs

@app.get("/audit")
def get_audit():
    return audit_logs