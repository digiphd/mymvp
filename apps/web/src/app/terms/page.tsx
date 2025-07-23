'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function TermsOfService() {
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
              Terms of Service
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
              <h2 className="text-xl font-semibold text-blue-900 mb-3">Agreement Overview</h2>
              <p className="text-blue-800 mb-0">
                These Terms of Service govern your use of myMVP's website and services. By using our services, you agree to be bound by these terms. Please read them carefully.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              
              <p className="text-gray-700 mb-4">
                By accessing or using myMVP's website, services, or submitting an application, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
              
              <p className="text-gray-700 mb-6">
                These terms apply to all visitors, users, and clients of myMVP's services, including but not limited to our website, consultation services, MVP development services, and any related communications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              
              <p className="text-gray-700 mb-4">
                myMVP provides AI-powered software development services, specifically:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>MVP Development:</strong> Custom minimum viable product development using AI-accelerated processes</li>
                <li><strong>Full-Stack Applications:</strong> Complete web applications with backend and frontend components</li>
                <li><strong>Consultation Services:</strong> Technical advisory and project scoping services</li>
                <li><strong>Project Management:</strong> Coordination and delivery of development projects</li>
                <li><strong>Quality Assurance:</strong> Testing and optimization of delivered applications</li>
              </ul>
              
              <p className="text-gray-700 mb-6">
                All services are provided on a project basis according to agreed specifications and timelines. We reserve the right to modify our service offerings at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Application and Acceptance Process</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Application Submission</h3>
              <p className="text-gray-700 mb-4">
                By submitting an application through our website or other channels, you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Confirm that all information provided is accurate and complete</li>
                <li>Authorize us to evaluate your project requirements</li>
                <li>Understand that submission does not guarantee acceptance</li>
                <li>Agree to provide additional information if requested</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Selection</h3>
              <p className="text-gray-700 mb-4">
                myMVP reserves the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Accept or decline any project application at our sole discretion</li>
                <li>Require additional information before making acceptance decisions</li>
                <li>Set eligibility criteria for potential clients</li>
                <li>Terminate the application process at any time without providing reasons</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Agreement</h3>
              <p className="text-gray-700 mb-6">
                Upon acceptance, a separate Service Agreement will be executed detailing specific project terms, deliverables, timelines, and payment schedules. This Service Agreement will supplement these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing and Fees</h3>
              <p className="text-gray-700 mb-4">
                Service fees are as specified in individual Service Agreements. Unless otherwise specified:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>All prices are in USD and exclude applicable taxes</li>
                <li>Pricing is based on project scope as agreed upon</li>
                <li>Additional work outside scope may incur additional charges</li>
                <li>Price changes require written agreement from both parties</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Schedule</h3>
              <p className="text-gray-700 mb-4">
                Unless otherwise specified in the Service Agreement:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Deposit:</strong> 50% deposit required before project commencement</li>
                <li><strong>Final Payment:</strong> 50% due upon project completion and delivery</li>
                <li><strong>Payment Methods:</strong> Credit card, bank transfer, or other approved methods</li>
                <li><strong>Late Payments:</strong> Subject to 1.5% monthly interest charges</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Policy</h3>
              <p className="text-gray-700 mb-4">
                Refunds are handled according to the following policy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Before Work Begins:</strong> Full refund available within 48 hours of payment</li>
                <li><strong>During Development:</strong> Refunds calculated based on work completed</li>
                <li><strong>After Delivery:</strong> 30-day money-back guarantee if deliverables don't meet agreed specifications</li>
                <li><strong>Processing Time:</strong> Refunds processed within 14 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Project Delivery and Timeline</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Commitments</h3>
              <p className="text-gray-700 mb-4">
                We strive to deliver projects within specified timelines. However:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Timeline estimates are based on information provided during scoping</li>
                <li>Changes to project scope may affect delivery schedules</li>
                <li>Client responsiveness affects project timeline</li>
                <li>Force majeure events may cause delays beyond our control</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Responsibilities</h3>
              <p className="text-gray-700 mb-4">
                Timely delivery requires client cooperation, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Prompt response to requests for information or feedback</li>
                <li>Timely review and approval of deliverables</li>
                <li>Provision of necessary access credentials or resources</li>
                <li>Clear communication of requirements and changes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Acceptance and Revisions</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Clients have 7 business days to review and provide feedback on deliverables</li>
                <li>Minor revisions within original scope are included</li>
                <li>Major changes may require additional time and cost</li>
                <li>Failure to respond within review period constitutes acceptance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Ownership</h3>
              <p className="text-gray-700 mb-4">
                Upon full payment, clients receive:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Full ownership of custom code developed specifically for their project</li>
                <li>All source code and documentation created for the project</li>
                <li>Rights to modify, distribute, and use the delivered application</li>
                <li>Ownership of project-specific design assets and content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">myMVP Reserved Rights</h3>
              <p className="text-gray-700 mb-4">
                myMVP retains rights to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Our proprietary development methodologies and processes</li>
                <li>General knowledge and experience gained during the project</li>
                <li>Right to showcase work in portfolios (with client approval)</li>
                <li>Reusable code components and frameworks we developed</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Components</h3>
              <p className="text-gray-700 mb-6">
                Projects may include open-source software and third-party services. Clients are responsible for complying with applicable licenses and terms of service for these components.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Confidentiality</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mutual Confidentiality</h3>
              <p className="text-gray-700 mb-4">
                Both parties agree to maintain confidentiality regarding:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Proprietary business information and trade secrets</li>
                <li>Project specifications and technical details</li>
                <li>Financial information and business strategies</li>
                <li>Any information marked as confidential</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Exceptions</h3>
              <p className="text-gray-700 mb-4">
                Confidentiality obligations do not apply to information that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Is publicly available or becomes public through no breach of this agreement</li>
                <li>Was known prior to disclosure</li>
                <li>Is independently developed</li>
                <li>Must be disclosed by law or court order</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Warranties and Disclaimers</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Warranty</h3>
              <p className="text-gray-700 mb-4">
                myMVP warrants that services will be performed in a professional manner consistent with industry standards. We provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>30-day warranty on delivered code against defects</li>
                <li>Correction of bugs and issues identified within warranty period</li>
                <li>Support for deployment and initial setup issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Disclaimer of Warranties</h3>
              <p className="text-gray-700 mb-4">
                EXCEPT AS EXPRESSLY STATED, ALL SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE SPECIFICALLY DISCLAIM:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>GUARANTEES OF SPECIFIC BUSINESS RESULTS OR OUTCOMES</li>
                <li>WARRANTIES REGARDING THIRD-PARTY INTEGRATIONS OR SERVICES</li>
                <li>GUARANTEES OF UNINTERRUPTED OR ERROR-FREE OPERATION</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>myMVP's total liability shall not exceed the amount paid for services</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We are not responsible for business losses, lost profits, or lost data</li>
                <li>Liability limitations apply regardless of the form of action</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Exceptions</h3>
              <p className="text-gray-700 mb-6">
                These limitations do not apply to damages caused by gross negligence, willful misconduct, or violations of confidentiality obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              
              <p className="text-gray-700 mb-4">
                Each party agrees to indemnify and hold harmless the other party from claims arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Breach of this agreement</li>
                <li>Negligent or wrongful acts</li>
                <li>Infringement of third-party rights</li>
                <li>Violation of applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination by Client</h3>
              <p className="text-gray-700 mb-4">
                Clients may terminate services with written notice. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Client remains responsible for payment of work completed</li>
                <li>myMVP will deliver work completed up to termination date</li>
                <li>Any prepaid fees for unperformed work will be refunded</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination by myMVP</h3>
              <p className="text-gray-700 mb-4">
                myMVP may terminate services for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Non-payment of fees</li>
                <li>Breach of agreement terms</li>
                <li>Inability to perform due to client actions</li>
                <li>Other material breach of contract</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Effect of Termination</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Confidentiality obligations continue after termination</li>
                <li>Client retains ownership of work paid for</li>
                <li>Both parties released from future performance obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
              
              <p className="text-gray-700 mb-4">
                Neither party shall be liable for delays or failure to perform due to circumstances beyond reasonable control, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Natural disasters, pandemics, or acts of God</li>
                <li>Government actions, laws, or regulations</li>
                <li>War, terrorism, or civil unrest</li>
                <li>Internet outages or infrastructure failures</li>
                <li>Third-party service provider failures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Informal Resolution</h3>
              <p className="text-gray-700 mb-4">
                Parties agree to first attempt informal resolution of disputes through direct negotiation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mediation</h3>
              <p className="text-gray-700 mb-4">
                If informal resolution fails, disputes will be submitted to binding mediation before pursuing other remedies.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Arbitration</h3>
              <p className="text-gray-700 mb-6">
                Any remaining disputes will be resolved through binding arbitration under the rules of the American Arbitration Association. Arbitration will be conducted in English and shall be the exclusive remedy for dispute resolution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              
              <p className="text-gray-700 mb-6">
                These Terms of Service shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to conflict of law principles. Any legal actions must be brought in the appropriate courts of Delaware.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. General Provisions</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms of Service, together with any Service Agreement and Privacy Policy, constitute the entire agreement between the parties.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Modifications</h3>
              <p className="text-gray-700 mb-4">
                We may update these terms periodically. Material changes will be communicated via email or website notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision is found unenforceable, the remainder of the agreement remains in effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Assignment</h3>
              <p className="text-gray-700 mb-6">
                Clients may not assign their rights under this agreement without written consent. myMVP may assign this agreement in connection with a business transfer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
              
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@mymvp.io</p>
                <p className="text-gray-700 mb-2"><strong>General Inquiries:</strong> hello@mymvp.io</p>
                <p className="text-gray-700 mb-2"><strong>Response Time:</strong> We respond to legal inquiries within 5 business days</p>
                <p className="text-gray-700 mb-0"><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM EST</p>
              </div>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Legal Disclaimer</h3>
              <p className="text-yellow-800 text-sm mb-0">
                These terms are provided as a comprehensive framework but should be reviewed by qualified legal counsel before relying on them for your business. Laws vary by jurisdiction, and specific circumstances may require modifications to these terms.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}