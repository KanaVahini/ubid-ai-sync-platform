import requests
import uuid
from datetime import datetime
from rapidfuzz import fuzz
from sklearn.tree import DecisionTreeClassifier
from rapidfuzz import fuzz


# =========================================
# ROUTING
# =========================================

def route_event(ubid: str):

    last_digit = int(ubid[-1])

    if last_digit % 2 == 0:
        return ["factories"]

    else:
        return ["shop"]


# =========================================
# TRANSLATION
# =========================================

def translate_event(event, target):

    data = event.payload

    if target == "factories":

        return {
            "addr_line1": data.get("address"),
            "phone_no": data.get("phone")
        }

    elif target == "shop":

        return {
            "shop_address": data.get("address"),
            "contact": data.get("phone")
        }


# =========================================
# SENDING
# =========================================

def send_to_target(target, data):

    url_map = {
        "factories": "http://127.0.0.1:8000/factories/update",
        "shop": "http://127.0.0.1:8000/shop/update"
    }

    try:

        response = requests.post(
            url_map[target],
            json=data
        )

        return response.status_code

    except:

        return "failed"


# =========================================
# AUDIT LOG
# =========================================

audit_logs = []


def log_event(
    ubid,
    source,
    target,
    status,
    payload
):

    log = {

        "event_id": str(uuid.uuid4()),
        "ubid": ubid,
        "source": source,
        "target": target,
        "status": status,
        "timestamp": datetime.now().isoformat(),
        "payload": payload

    }

    audit_logs.append(log)


# =========================================
# TRUST SCORE ENGINE
# =========================================

trust_scores = {

    "SWS": 0.95,
    "DEPT": 0.72,
    "FACTORIES": 0.88,
    "SHOP": 0.80

}
retry_history = {

    "SWS": 1,
    "DEPT": 4,
    "FACTORIES": 2,
    "SHOP": 1

}

# =========================================
# FIELD AUTHORITY
# =========================================

field_authority = {

    "address": "SWS",
    "phone": "SWS",
    "gst": "DEPT",
    "license_status": "DEPT"

}


def get_trust_score(system_name):

    return trust_scores.get(
        system_name.upper(),
        0.50
    )

def get_authority_bonus(event):

    payload = event.payload

    bonus = 0

    for field in payload.keys():

        authority = field_authority.get(field)

        if authority == event.source_system:
            bonus += 0.15

    return bonus

def get_authority_bonus(event):

    payload = event.payload

    bonus = 0

    for field in payload.keys():

        authority = field_authority.get(field)

        if authority == event.source_system:
            bonus += 0.15

    return bonus


# =========================================
# SEMANTIC SEVERITY
# =========================================

def semantic_severity(event1, event2):

    severity = 0

    for key in event1.payload.keys():

        val1 = str(event1.payload.get(key, ""))
        val2 = str(event2.payload.get(key, ""))

        similarity = fuzz.ratio(val1, val2)

        # lower similarity = bigger change
        severity += (100 - similarity) / 100

    return round(severity, 2)


def update_trust_score(
    system_name,
    success=True
):

    current = trust_scores.get(
        system_name.upper(),
        0.50
    )

    if success:
        current += 0.01

    else:
        current -= 0.03

    current = max(0, min(current, 1))

    trust_scores[
        system_name.upper()
    ] = round(current, 2)

def track_update_frequency(system_name):

    count = update_frequency.get(system_name, 0)

    count += 1

    update_frequency[system_name] = count

    return count

def get_frequency_penalty(system_name):

    count = update_frequency.get(system_name, 0)

    if count > 5:
        return 0.10

    return 0
# =========================================
# RETRY PENALTY
# =========================================

def get_retry_penalty(system_name):

    retries = retry_history.get(system_name, 0)

    return retries * 0.02
    
    

    current = trust_scores.get(
        system_name.upper(),
        0.50
    )

    if success:
        current += 0.01

    else:
        current -= 0.03

    # clamp between 0 and 1
    current = max(0, min(current, 1))

    trust_scores[
        system_name.upper()
    ] = round(current, 2)


# =========================================
# CONFLICT STORAGE
# =========================================

recent_events = {}
update_frequency = {}


# =========================================
# ML MODEL
# =========================================

# features:
# [source, time_diff]

X = [

    [1, 1],
    [1, 2],
    [0, 10],
    [0, 8],
    [1, 3]

]

# 1 = SWS wins
# 0 = DEPT wins

y = [1, 1, 0, 0, 1]

model = DecisionTreeClassifier()

model.fit(X, y)


# =========================================
# CONFLICT DETECTION
# =========================================

def detect_conflict(event):

    ubid = event.ubid

    current_time = datetime.now()

    if ubid in recent_events:

        prev_event, prev_time = recent_events[ubid]

        time_diff = (
            current_time - prev_time
        ).seconds

        if time_diff <= 30:

            return prev_event, time_diff

    recent_events[ubid] = (
        event,
        current_time
    )

    return None, None


# =========================================
# CONFLICT RESOLUTION
# =========================================

def resolve_conflict(
    event1,
    event2,
    time_diff
):

    trust1 = get_trust_score(
        event1.source_system
    )

    trust2 = get_trust_score(
        event2.source_system
    )

    # freshness
    freshness1 = max(
        0.1,
        1 - (time_diff / 30)
    )

    freshness2 = freshness1

    # authority bonus
    authority1 = get_authority_bonus(event1)

    authority2 = get_authority_bonus(event2)

    # semantic severity
    severity = semantic_severity(
        event1,
        event2
    )

    # retry penalty
    retry_penalty1 = get_retry_penalty(
        event1.source_system
    )

    retry_penalty2 = get_retry_penalty(
        event2.source_system
    )

    # spam / frequency penalty
    freq_penalty1 = get_frequency_penalty(
        event1.source_system
    )

    freq_penalty2 = get_frequency_penalty(
        event2.source_system
    )

    # final intelligent scoring
    score1 = (

        (trust1 * 0.5)
        + (freshness1 * 0.2)
        + authority1
        + (severity * 0.1)

        - retry_penalty1
        - freq_penalty1

    )

    score2 = (

        (trust2 * 0.5)
        + (freshness2 * 0.2)
        + authority2
        + (severity * 0.1)

        - retry_penalty2
        - freq_penalty2

    )

    confidence = round(
        max(score1, score2),
        2
    )

    if score1 >= score2:

        winner = event1

    else:

        winner = event2

    explanation = {

        "winner": winner.source_system,

        "confidence": confidence,

        "reason": [

            "Higher trust score",
            "Freshness evaluated",
            "Authority-aware governance logic",
            "Semantic severity evaluated",
            "Retry instability penalty applied"

        ]

    }

    return winner, explanation