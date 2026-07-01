export default function Privacy() {
  const sections = [
    { title: "Information We Collect", content: "We collect information you provide during registration (username, email), transaction data, and usage analytics. We do not collect payment card information — all payments are processed securely through third-party providers." },
    { title: "How We Use Your Information", content: "We use your information to: process orders and payments, send order confirmations and updates, provide customer support, prevent fraud and unauthorized access, and improve our services." },
    { title: "Information Security", content: "We implement industry-standard security measures including 256-bit SSL encryption, secure data storage, and regular security audits. Your password is hashed and never stored in plain text." },
    { title: "Cookies", content: "We use cookies and local storage to maintain your session, remember your preferences (such as dark/light mode), and improve your experience. You can disable cookies in your browser settings, though this may affect functionality." },
    { title: "Data Sharing", content: "We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist in operating our website, subject to strict confidentiality agreements." },
    { title: "Data Retention", content: "We retain your account information as long as your account is active. Transaction records are kept for 7 years for legal and accounting purposes. You may request deletion of your account and personal data at any time." },
    { title: "Your Rights", content: "You have the right to access, correct, or delete your personal information. You may also request a copy of your data or withdraw consent for data processing. Contact us at support@ramosvault.com to exercise these rights." },
    { title: "Changes to Privacy Policy", content: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Continued use of the service after changes constitutes acceptance." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: July 1, 2025</p>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        At RamosVault, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your information when you use our service.
      </p>
      <div className="space-y-4">
        {sections.map(s => (
          <div key={s.title} className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="font-bold mb-2 text-base">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Privacy questions? <a href="mailto:support@ramosvault.com" className="text-primary hover:underline">support@ramosvault.com</a>
      </p>
    </div>
  );
}
