# Dupe Checker – Darkbytes Pro 

## 🔍 Overview

**Dupe Checker** is a Tampermonkey script purpose-built for the **Sophos MDR DarkBytes portal**. It allows analysts to instantly search through case notes using keywords and identify potential duplicate cases by **Case ID**. This version includes a complete **professional UI ** with improved usability, dark style aesthetics, and handy features like minimize/restore functionality — all without modifying any core request or data logic.

---

## 🎯 Features

- 🔐 **Secure Token Handling** – Uses `sessionStorage` tokens (accessToken & idToken) already available in the session.
- 🧠 **Intelligent Case ID Filtering** – Searches case notes and highlights all matching Case IDs.
- 🔗 **Hyperlinked Results** – Clickable Case IDs open in a new tab directly in Sophos SOC portal.
- ⚡ **Fast Drag & Move UI** – Easily reposition the tool on-screen with smooth drag performance.
- 🪟 **Minimize & Restore** – Minimize the panel to clean up your screen, and restore it without refreshing.
- 🖥️ **Cyber-Themed UI** – Custom dark theme with neon accents for better visibility and style.
- 📁 **Show/Hide Results Toggle** – Clean toggle for controlling result visibility after search.
- 📦 **Fully Resizable Panel** – Resize to your preferred viewing space.

---

## 🧪 Use Case

This script is ideal for MDR analysts or threat responders who want a **faster way to triage duplicate tickets** and improve response time without waiting for backend automation or DB syncing.

---

## 💻 Installation

1. **Install [Tampermonkey](https://www.tampermonkey.net/)** on your browser (Chrome/Firefox/Edge).
2. Click on **“Create a new script”** in Tampermonkey.
3. Copy and paste the contents of `dupe-checker.user.js` into the editor.
4. Save the script.
5. Navigate to any case inside the Sophos SOC Portal:  
   `https://portal.mdr.sophos.com/soc/cases/*`
6. The Dupe Checker will load automatically in the **bottom-left** of the page.

---

## 📸 Screenshot

![git1](https://github.com/user-attachments/assets/b39f91b5-8da3-4e7b-acde-069516231f5a)

![git2](https://github.com/user-attachments/assets/ce155121-0d94-4f08-a0b5-67cca1ef124d)

![git3](https://github.com/user-attachments/assets/bc6845ae-5d5a-4584-85a5-d32c2271c101)

---

## 🛠️ Tech Details

- Written in **Vanilla JavaScript**
- Styling handled via dynamic `<style>` injection
- Uses `fetch()` for data calls (no external libraries)
- No external APIs or tracking — operates only on current session and DOM

---

## 👥 Authors

- **Sharan K**  - Threat Analyst  - I
- **Rohith B**  Threat Analyst - Intern

---

## 🔐 Disclaimer

This tool is provided *as-is* for internal productivity purposes. It respects all session permissions and does not bypass any authentication mechanisms. Use responsibly in accordance with your organization’s security policies.

---

## 📄 License

MIT License — Feel free to fork, modify, and use in your own  workflow.

