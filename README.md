# Your Pickle Brand Name

A beginner-friendly Flask storefront with a local Ollama-powered pickle information chat. Replace the sample brand, contact details, product data, prices, and ingredients in `app.py` before using the site for a real business.

## What is included

- Responsive product catalog with illustrative jar artwork and sample prices in INR.
- About, contact, and order-request sections.
- A chat API at `/api/chat` that sends the recent chat context and the shop's configured facts to a local Ollama model, so follow-up questions work. The assistant can answer general questions too, while using configured data as the source of truth for shop-specific claims.
- Server-side validation for chat and order form inputs.

The order form is intentionally a demo: it validates the details but does not save or send them. The chat directs customers to call or email to place a real order. Availability and delivery areas, charges, and timelines are not configured, so customers should contact the business to confirm them. Connect a suitable order-management service before accepting real orders. The phone, email, prices, ingredients, and product data are examples and must be verified.

## 1. Install Ollama

Download and install Ollama for your operating system from [ollama.com/download](https://ollama.com/download). Start the Ollama application/service, then in PowerShell pull the model:

```powershell
ollama pull llama3.2:3b
```

Check that the model is installed:

```powershell
ollama list
```

The Flask app uses Ollama's local API at `http://localhost:11434`. To use another installed model, set `OLLAMA_MODEL` before starting Flask, for example:

```powershell
$env:OLLAMA_MODEL = "qwen2.5:3b"
```

## 2. Create a Python environment and install Flask

Open PowerShell in this `pickle_shop` folder:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

If PowerShell blocks activation, use the environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 3. Run the website

From the `pickle_shop` folder:

```powershell
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser. Keep the Ollama app/service running for chat responses. If Ollama is unavailable, the rest of the website will still work and the chat will show a clear connection message.

## 4. Customize the shop

Edit `BUSINESS` and `PRODUCTS` near the top of `app.py`. Product prices are in rupees and currently shown for 250 g jars. The chat uses these same configured details as its only business reference. Check every ingredient and price for accuracy before publishing.

This is a local development starter, not a production deployment. Before putting it on the public internet, use a production WSGI server, add CSRF/rate-limit protections, configure secure handling for orders and personal data, and review food labeling, privacy, and local business requirements.
