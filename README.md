# BlockAuth

A modern, responsive product authenticity system for electronic devices, currently implemented as a web app with QR-based verification. Blockchain integration is planned for the future.

## 🚀 Features

- **Manufacturer Portal**: Register products and generate QR codes
- **Retailer Portal**: Record sales and buyer information
- **Customer Portal**: Verify authenticity and view sale history
- **Modern UI**: Clean, professional interface with smooth user experience
- **Responsive**: Optimized for all device sizes
- **Planned Blockchain**: Future-proof design for decentralized verification

## 📊 Current Level

- Web app built with Vite, React, and TypeScript
- All data managed within the app (blockchain integration not yet implemented)
- QR codes generated for each product for customer verification

## 🔮 Future Plans

- Integrate blockchain (Ethereum) to store product registration, sales, and verification data
- Use smart contracts for tamper-proof authenticity records
- Enable decentralized verification for customers


## 📸 Screenshots

<img width="502" alt="Screenshot 2025-07-04 at 10 50 28 AM" src="https://github.com/user-attachments/assets/cd5f7f76-9580-409e-9cca-d6ceb2cd230c" />
<img width="502" alt="Screenshot 2025-07-04 at 10 51 08 AM" src="https://github.com/user-attachments/assets/22a4e88e-a634-4a3a-94e7-79368469a617" />
<img width="502" alt="Screenshot 2025-07-04 at 10 50 52 AM" src="https://github.com/user-attachments/assets/5ec95b19-6024-4273-ac39-ef6b92c6c6e5" />
<img width="502" alt="Screenshot 2025-07-04 at 10 53 33 AM" src="https://github.com/user-attachments/assets/0408f705-80bb-4973-bc59-b97778413772" />
<img width="502" alt="Screenshot 2025-07-04 at 11 06 31 AM" src="https://github.com/user-attachments/assets/8ca3e3c4-ed3c-410a-9e68-7cec2275cc68" />
<img width="502" alt="Screenshot 2025-07-04 at 11 02 10 AM" src="https://github.com/user-attachments/assets/823f8b1c-dff3-4458-b130-a1e94be88312" />
<img width="502" alt="Screenshot 2025-07-04 at 11 02 24 AM" src="https://github.com/user-attachments/assets/1f0e6043-d5d2-4a61-b6ed-82bb9727e42c" />
<img width="502" alt="Screenshot 2025-07-04 at 11 02 38 AM" src="https://github.com/user-attachments/assets/0459cca4-d4a3-43ea-8e74-0a7200373463" />

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | JavaScript library for building user interfaces |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Strongly typed programming language for scalable apps |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) | Utility-first CSS framework for rapid styling |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Fast build tool and development server |
| ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=vercel&logoColor=white) | Accessible UI components |
| ![Radix UI](https://img.shields.io/badge/Radix%20UI-111827?style=for-the-badge&logo=radix-ui&logoColor=white) | Primitives for building design systems |
| ![Ethers.js](https://img.shields.io/badge/Ethers.js-4E8EE9?style=for-the-badge&logo=ethereum&logoColor=white) | (Planned) Blockchain interaction library |
| ![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white) | (Planned) Smart contract language |
| ![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white) | (Planned) Decentralized file storage |

## 🧰 Tools & Utilities

| Tool | Purpose |
|------|---------|
| ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) | Code editing |
| ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) | Version control |
| ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) | Project hosting |

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blockauth
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Shadcn/ui panels (Manufacturer, Retailer, Customer)
│   └── ...        # Custom components
├── hooks/         # Custom React hooks
├── lib/           # Utilities (blockchain, QR, etc.)
├── pages/         # Main and 404 pages
└── main.tsx       # Application entry point
```

## 🎨 Customization

You can customize colors, fonts, and other design tokens in the `src/index.css` file. Update contract addresses and ABI in `src/lib/utils.ts` as needed (for blockchain integration).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Arun Pratap Singh**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Arun%20Pratap%20Singh-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/arun-pratap-singh09)  
[![GitHub](https://img.shields.io/badge/GitHub-gitarun009-black?style=flat-square&logo=github)](https://github.com/gitarun009) 
