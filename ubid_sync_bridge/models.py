from pydantic import BaseModel
from typing import Dict, Any

class Event(BaseModel):
    ubid: str
    service_type: str
    source_system: str
    timestamp: str
    payload: Dict[str, Any]