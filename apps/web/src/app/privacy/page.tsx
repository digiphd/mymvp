'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  const lastUpdated = "January 22, 2025"

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {lastUpdated}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">Your Privacy Matters</h2>
              <p className="text-blue-800 mb-0">
                At MyMVP, we are committed to protecting your privacy and being transparent about how we collect, use, and protect your information. This Privacy Policy explains our practices in detail.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide to Us</h3>
              <p className="text-gray-700 mb-4">
                We collect information you directly provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
                <li><strong>Application Information:</strong> Product descriptions, technical requirements, business details, team composition, budget information</li>
                <li><strong>Communication Data:</strong> Messages, emails, and other communications with us</li>
                <li><strong>Payment Information:</strong> Billing address and payment details (processed securely through third-party providers)</li>
                <li><strong>Project Information:</strong> Requirements, specifications, and project-related documents</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect Automatically</h3>
              <p className="text-gray-700 mb-4">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, and navigation patterns</li>
                <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
                <li><strong>Cookies and Tracking:</strong> Information collected through cookies, pixels, and similar technologies</li>
                <li><strong>Performance Data:</strong> Website performance and error reporting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              
              <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Delivery</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Evaluate your project requirements and provide quotes</li>
                <li>Develop and deliver your MVP according to specifications</li>
                <li>Communicate with you about your project status and updates</li>
                <li>Provide customer support and technical assistance</li>
                <li>Process payments and manage billing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Operations</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Improve our services and website functionality</li>
                <li>Analyze usage patterns and optimize user experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
                <li>Enforce our Terms of Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing (With Your Consent)</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Send newsletters and product updates</li>
                <li>Notify you about new services or features</li>
                <li>Conduct surveys and gather feedback</li>
                <li>Create anonymized case studies (with explicit permission)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share information with trusted third-party service providers who assist us in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Email communications (SendGrid, Mailchimp)</li>
                <li>Cloud hosting and storage (AWS, Vercel)</li>
                <li>Analytics and performance monitoring (Google Analytics, Vercel Analytics)</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose information when required by law or to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Comply with legal process, court orders, or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate fraud or security issues</li>
                <li>Enforce our Terms of Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-gray-700 mb-6">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction. We will notify you of any such change in ownership or control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Encryption:</strong> All data transmitted to and from our servers is encrypted using SSL/TLS</li>
                <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                <li><strong>Regular Security Audits:</strong> Periodic assessments of our security practices</li>
                <li><strong>Employee Training:</strong> Staff training on privacy and security best practices</li>
                <li><strong>Incident Response:</strong> Procedures for handling potential security breaches</li>
              </ul>
              
              <p className="text-gray-700 mb-6">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you promptly of any known security breaches.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Access and Portability</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Request copies of your personal information</li>
                <li>Receive your data in a portable format</li>
                <li>Understand how your information is being used</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Correction and Updates</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Update or correct your personal information</li>
                <li>Modify your communication preferences</li>
                <li>Update your project requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Deletion and Restriction</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Request deletion of your personal information (subject to legal requirements)</li>
                <li>Restrict processing of your information</li>
                <li>Object to certain uses of your data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Communications</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Opt out of marketing emails at any time</li>
                <li>Adjust your communication preferences</li>
                <li>Unsubscribe from newsletters and updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h3>
              <p className="text-gray-700 mb-6">
                You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality. Most browsers allow you to refuse or delete cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
              
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Adherence to international data protection standards</li>
                <li>Use of approved transfer mechanisms (Standard Contractual Clauses)</li>
                <li>Regular assessment of data protection practices in destination countries</li>
                <li>Encryption during transmission and storage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide services and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Project Data:</strong> Retained for the duration of the project plus 7 years for business records</li>
                <li><strong>Communication Records:</strong> Kept for 3 years after project completion</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Legal Compliance:</strong> As required by applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              
              <p className="text-gray-700 mb-6">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Post the updated policy on our website</li>
                <li>Update the "Last updated" date</li>
                <li>Notify you of material changes via email</li>
                <li>Provide clear information about what has changed</li>
              </ul>
              
              <p className="text-gray-700 mb-6">
                Your continued use of our services after changes to this policy constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              
              <p className="text-gray-700 mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@mymvp.io</p>
                <p className="text-gray-700 mb-2"><strong>Privacy Officer:</strong> hello@mymvp.io</p>
                <p className="text-gray-700 mb-2"><strong>Response Time:</strong> We will respond to privacy inquiries within 30 days</p>
                <p className="text-gray-700 mb-0"><strong>Data Protection Officer:</strong> Available for EU/GDPR related inquiries</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Compliance with Laws</h2>
              
              <p className="text-gray-700 mb-4">
                This Privacy Policy is designed to comply with applicable privacy laws, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>GDPR:</strong> European Union General Data Protection Regulation</li>
                <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
                <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act (Canada)</li>
                <li><strong>Other applicable local and international privacy laws</strong></li>
              </ul>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}