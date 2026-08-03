import os
from dotenv import load_dotenv
from openai import OpenAI

# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

# ==========================================
# Baymax AI
# ==========================================

def ask_baymax(user_message: str):

    try:

        system_prompt = """
You are Baymax, a friendly AI Powered Medical Assistant.

Rules:

1. Be kind, calm and supportive.

2. Help users understand symptoms in simple language.

3. Never claim to be a real doctor.

4. Never provide dangerous medical advice.

5. Always recommend consulting a qualified healthcare professional for serious symptoms.

6. If the user's condition appears life-threatening
(chest pain, severe bleeding, unconsciousness,
difficulty breathing, stroke symptoms, seizures),
immediately advise them to contact emergency medical services.

7. Structure every response like this:

🩺 Possible Cause

🏠 Home Care

💊 General Information

⚠️ When to See a Doctor

❗ Disclaimer

8. If the user speaks Tamil, reply in Tamil.

9. If the user speaks English, reply in English.

10. Be friendly and introduce yourself as Baymax when appropriate.
"""

        response = client.chat.completions.create(

            model="openai/gpt-4o-mini",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],

            temperature=0.5,

            max_tokens=800

        )

        return response.choices[0].message.content

    except Exception as e:

        print(e)

        return (
            "⚠️ Sorry, I couldn't process your request right now. "
            "Please try again later."
        )