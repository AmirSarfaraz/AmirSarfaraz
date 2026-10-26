// Everything written on the profile. Facts match the LinkedIn profile and the website.
export const SITE = "https://www.amirsarfaraz.com";

export const links = [
  { key: "site", label: "website", cmd: "open site", href: SITE, icon: "site" },
  { key: "linkedin", label: "linkedin", cmd: "open linkedin", href: "https://www.linkedin.com/in/amir-sarfaraz-457b9a234/", icon: "linkedin" },
  { key: "telegram", label: "telegram", cmd: "open telegram", href: "https://t.me/AmirhSarfaraz", icon: "telegram" },
];


export const neofetch = [
  ["Name", "Amirhossein Sarfaraz"],
  ["Role", "Back-End .NET Developer"],
  ["Base", "Tehran, Iran"],
  ["Work", "Software Developer @ IAU Central Org."],
  ["Building", "Sajed ERP · Sajed App · SajedDoc (AI)"],
  ["Freelance", "Komando · WinUp360 · Hoshyar · Noor"],
  ["Co-founder", "Grand Role Play"],
  ["Core", "C# · ASP.NET Core · SQL Server · React"],
  ["Data", "SQL Server · PostgreSQL · MySQL · Redis"],
  ["AI", "PyTorch · OpenCV · ONNX · FastAPI"],
  ["Uptime", "shipping to production since Dec 2023"],
  ["Status", "open to back-end & full-stack .NET roles"],
];

export const stack = [
  { group: "languages", items: ["csharp:C#", "typescript:TypeScript", "javascript:JavaScript", "python:Python", "html5:HTML", "css:CSS"], also: "T-SQL" },
  { group: "backend", items: ["dotnet:.NET", "aspnetcore:ASP.NET Core", "efcore:EF Core", "swagger:Swagger", "jwt:JWT", "rabbitmq:RabbitMQ", "redis:Redis", "meilisearch:MeiliSearch"], also: "ASP.NET MVC · SignalR · Hangfire · Dapper · MediatR (CQRS) · FluentValidation · Serilog · xUnit" },
  { group: "data", items: ["sqlserver:SQL Server", "postgresql:PostgreSQL", "mysql:MySQL"], also: "stored procedures · database design · data analysis" },
  { group: "frontend", items: ["react:React", "nextjs:Next.js", "vite:Vite", "tailwind:Tailwind CSS", "reactquery:TanStack Query", "reactrouter:React Router", "zustand:Zustand", "reacthookform:React Hook Form", "zod:Zod", "motion:Motion", "gsap:GSAP", "bootstrap:Bootstrap", "jquery:jQuery"] },
  { group: "devops", items: ["docker:Docker", "nginx:Nginx", "githubactions:GitHub Actions", "git:Git", "github:GitHub", "minio:MinIO", "vercel:Vercel"] },
  { group: "ai-ml", items: ["pytorch:PyTorch", "onnx:ONNX Runtime", "opencv:OpenCV", "fastapi:FastAPI", "scikitlearn:scikit-learn", "numpy:NumPy"], also: "Tesseract OCR · OpenAI API · LLM streaming" },
  { group: "tools", items: ["visualstudio:Visual Studio", "vscode:VS Code", "postman:Postman", "claude:Claude Code", "cursor:Cursor", "copilot:GitHub Copilot"] },
];

export const projects = [
  { slug: "sajed-erp", name: "Sajed ERP", status: "in production", live: true, href: `${SITE}/#experience`,
    text: ["Modules of the university's integrated ERP: loans,", "employment status, missions, severance, HR"], tags: ["C#", "ASP.NET MVC", "SQL Server"] },
  { slug: "sajeddoc", name: "SajedDoc", status: "in production", live: true, href: `${SITE}/#projects`,
    text: ["AI classifier for uploaded HR documents —", "97.7% validation accuracy, ~13 ms per image on CPU"], tags: ["PyTorch", "OpenCV", "ONNX", "FastAPI"] },
  { slug: "sajed-app", name: "Sajed App", status: "2026", href: `${SITE}/#projects`,
    text: ["Self-service app for staff & faculty: 56-endpoint", "API with OTP login, PDF/QR documents, React UI"], tags: ["ASP.NET Core", "JWT", "React"] },
  { slug: "komando", name: "Komando", status: "live", live: true, href: "https://komando.shop",
    text: ["Outdoor & tactical gear store, built solo:", "API, GSAP storefront, staff panel, 240 endpoints"], tags: ["ASP.NET Core 9", "PostgreSQL", "Next.js"] },
  { slug: "winup360", name: "WinUp360", status: "live", live: true, href: "https://winup360.com",
    text: ["Sports-education platform: classes, enrollments,", "3 payment gateways, payouts to coaches & clubs"], tags: ["ASP.NET Core", "PostgreSQL", "React"] },
  { slug: "hoshyar", name: "Hoshyar", status: "2025", href: `${SITE}/#projects`,
    text: ["AI-powered workspace for organizations: AI chat", "& agents, calendars, task boards, document search"], tags: [".NET 9", "RabbitMQ", "MeiliSearch"] },
  { slug: "grand-role-play", name: "Grand Role Play", status: "co-founder", live: true, href: `${SITE}/#projects`,
    text: ["GTA V role-play community — web-shop back end", "wired into the game economy, servers"], tags: ["ASP.NET Core", "MySQL", "Dapper"] },
  { slug: "noor", name: "Noor", status: "2025", href: `${SITE}/#projects`,
    text: ["Rewards & engagement API behind Bonyad", "Salavat's app, deployed with GitHub Actions"], tags: ["ASP.NET Core", "SQL Server", "CI/CD"] },
  { slug: "aichat", name: "AIChatPlatform", status: "in progress", href: `${SITE}/#projects`,
    text: ["LLM chat platform with streaming replies,", "Google/GitHub sign-in and a credit system"], tags: ["ASP.NET Core", "SignalR", "React"] },
];
