export default function Terms() {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing and using RamosVault, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using RamosVault's particular services, you shall be subject to any posted guidelines or rules applicable to such services." },
    { title: "2. Products and Services", content: "RamosVault provides a digital marketplace for aged social media accounts, email accounts, VPN subscriptions, and related digital services. All products sold are for personal use only. Users are responsible for how they use the accounts they purchase." },
    { title: "3. Account Registration", content: "To access our services, you must register an account. You agree to provide accurate and complete information during registration and to keep your login credentials secure. You are responsible for all activities that occur under your account." },
    { title: "4. Payments and Wallet", content: "All purchases are made using your RamosVault wallet balance. Deposits must be made in Nigerian Naira (₦) unless otherwise stated. All sales are final once credentials are delivered. Refunds are only issued if an account is proven to be non-functional within 24 hours of purchase." },
    { title: "5. Refund Policy", content: "Refunds are available if: (a) the account does not match the description, (b) the account is inaccessible within 24 hours of purchase, or (c) credentials are incorrect. Refunds are processed back to your wallet balance. No cash refunds are issued." },
    { title: "6. Prohibited Uses", content: "You may not use our products for: illegal activities, spam operations, fraud, harassment, or any activity that violates the terms of service of the respective platform. Violation of these terms will result in account suspension without refund." },
    { title: "7. Privacy", content: "We collect only necessary information to provide our services. We do not sell your personal information to third parties. Please review our Privacy Policy for complete information on data collection and use." },
    { title: "8. Disclaimers", content: "Products are sold 'as is'. We do not guarantee continued access to social media platforms or email services as platform policies may change. We are not affiliated with Facebook, Instagram, TikTok, Twitter, or any other platform." },
    { title: "9. Limitation of Liability", content: "RamosVault shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services." },
    { title: "10. Changes to Terms", content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the modified terms." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm">Last updated: July 1, 2025</p>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-sm text-amber-600 dark:text-amber-400">
        Please read these terms carefully before using RamosVault. By using our service, you agree to these terms.
      </div>
      <div className="space-y-6">
        {sections.map(s => (
          <div key={s.title} className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="font-bold mb-2">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Questions? <a href="mailto:support@ramosvault.com" className="text-primary hover:underline">Contact us</a>
      </p>
    </div>
  );
}
