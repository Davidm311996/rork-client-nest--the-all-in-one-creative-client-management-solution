import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, FileText, Edit, Trash2, Copy, Eye, Lock } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import UpgradePrompt from '@/components/UpgradePrompt';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { ContractTemplate } from '@/types/contract';
import { SubscriptionTier } from '@/types/subscription';

const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Photography Contract',
    description: 'Wedding, portrait, and event photography services',
    content: `PHOTOGRAPHY SERVICES AGREEMENT

This Photography Services Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional photography business ("Photographer"), and [CLIENT_NAME] ("Client").

PROJECT DETAILS:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Event Type: Wedding Photography
Event Date: [PROJECT_START_DATE]
Event Location: [EVENT_LOCATION]
Completion Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Investment: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (50% of total fee)
Final Payment: Remaining balance due upon delivery
Payment Terms: Deposit due upon signing, final payment due within 30 days of delivery

SCOPE OF SERVICES:
1. Pre-wedding consultation and planning session
2. Full day wedding photography coverage (up to 10 hours)
3. Professional editing and color correction
4. Online gallery with high-resolution images
5. Print release for personal use
6. Delivery of 300-500 edited images

DELIVERABLES:
- Online gallery within 4-6 weeks of event
- High-resolution digital images
- Print release for personal use
- USB drive with all edited images (optional)

USAGE RIGHTS:
Client receives personal use rights to all delivered images. Commercial use requires separate licensing agreement. Photographer retains copyright and may use images for portfolio and marketing purposes.

CANCELLATION POLICY:
- 90+ days: Full refund minus $200 administrative fee
- 60-89 days: 50% refund
- 30-59 days: 25% refund
- Less than 30 days: No refund

FORCE MAJEURE:
Neither party shall be liable for delays or failures in performance due to circumstances beyond their control, including but not limited to acts of God, natural disasters, or government restrictions.

LIMITATION OF LIABILITY:
Photographer's liability shall not exceed the total amount paid by Client. Photographer is not responsible for lost or corrupted images due to equipment failure beyond reasonable backup procedures.

GOVERNING LAW:
This Agreement shall be governed by the laws of [STATE/PROVINCE].

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Photographer Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    isDefault: true,
    category: 'photography',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]', '[EVENT_LOCATION]', '[STATE/PROVINCE]'],
  },
  {
    id: '2',
    name: 'Graphic Design Contract',
    description: 'Logo design, branding, and marketing materials',
    content: `GRAPHIC DESIGN SERVICES AGREEMENT

This Graphic Design Services Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional design studio ("Designer"), and [CLIENT_NAME] ("Client").

PROJECT INFORMATION:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Project Type: Brand Identity Design
Start Date: [PROJECT_START_DATE]
Completion Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Investment: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (50% of total fee)
Payment Schedule: 50% deposit, 50% upon completion
Late Payment: 1.5% monthly fee on overdue amounts

SCOPE OF WORK:
1. Brand Strategy and Research
   - Competitor analysis
   - Target audience research
   - Brand positioning

2. Logo Design
   - 3 initial logo concepts
   - 2 rounds of revisions included
   - Final logo in multiple formats (AI, EPS, PNG, JPG)

3. Brand Identity System
   - Color palette (primary and secondary colors)
   - Typography selection
   - Brand guidelines document

4. Marketing Materials
   - Business card design
   - Letterhead design
   - Social media templates

DELIVERABLES:
- Logo files in vector and raster formats
- Brand guidelines document (PDF)
- Color palette specifications
- Typography guidelines
- Marketing material templates
- Source files (Adobe Illustrator, Photoshop)

REVISION POLICY:
Two rounds of revisions are included in the base price. Additional revisions will be charged at $75 per hour. Major scope changes may require a new agreement.

TIMELINE:
- Week 1-2: Research and initial concepts
- Week 3: Client review and feedback
- Week 4: Revisions and refinements
- Week 5: Final delivery and brand guidelines

INTELLECTUAL PROPERTY:
Upon final payment, Client will own all rights to the final approved designs. Designer retains the right to display work in portfolio and marketing materials.

CANCELLATION:
Client may cancel project with 48 hours written notice. Deposit is non-refundable. Client will be charged for work completed to date.

APPROVAL AND ACCEPTANCE:
Client approval of designs must be provided in writing (email acceptable). Verbal approvals are not binding.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Designer Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    isDefault: true,
    category: 'design',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '3',
    name: 'Video Production Contract',
    description: 'Commercial videos, documentaries, and content creation',
    content: `VIDEO PRODUCTION AGREEMENT

This Video Production Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional video production company ("Producer"), and [CLIENT_NAME] ("Client").

PROJECT DETAILS:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Production Type: Commercial Video Production
Pre-production Start: [PROJECT_START_DATE]
Delivery Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Production Budget: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (40% of total budget)
Payment Schedule:
- 40% deposit upon signing
- 40% on start of principal photography
- 20% upon final delivery

PRODUCTION PHASES:

1. PRE-PRODUCTION (Weeks 1-2):
   - Creative concept development
   - Script writing and storyboarding
   - Location scouting
   - Casting (if required)
   - Equipment and crew scheduling

2. PRODUCTION (Week 3):
   - Principal photography
   - On-location filming
   - Interview sessions
   - B-roll footage capture

3. POST-PRODUCTION (Weeks 4-6):
   - Video editing and assembly
   - Color correction and grading
   - Audio mixing and sound design
   - Motion graphics and titles
   - Client review and revisions

DELIVERABLES:
- Master video file (4K resolution)
- Web-optimized versions (1080p, 720p)
- Social media cuts (Instagram, TikTok formats)
- Raw footage archive (additional fee)
- Project files (additional fee)

REVISION POLICY:
Two rounds of revisions are included in post-production. Additional revisions will be charged at $150 per hour. Major changes to approved concepts may require additional fees.

USAGE RIGHTS:
Client receives unlimited usage rights for the final video for commercial purposes. Producer retains the right to use excerpts for portfolio and marketing purposes with Client's approval.

EQUIPMENT AND CREW:
Producer will provide all necessary equipment including cameras, lighting, audio equipment, and qualified crew members. Any special equipment requests may incur additional costs.

FORCE MAJEURE:
Production delays due to weather, illness, or other circumstances beyond Producer's control will not result in penalties. New dates will be scheduled at mutual convenience.

CANCELLATION POLICY:
- 30+ days before production: 50% refund of deposit
- 14-29 days: 25% refund of deposit
- Less than 14 days: No refund

LIABILITY:
Producer's liability is limited to the total contract amount. Producer carries professional liability insurance and will provide certificate upon request.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Producer Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-05',
    lastModified: '2024-01-15',
    isDefault: true,
    category: 'video',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '4',
    name: 'Web Development Contract',
    description: 'Website design and development services',
    content: `WEB DEVELOPMENT AGREEMENT

This Web Development Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional web development company ("Developer"), and [CLIENT_NAME] ("Client").

PROJECT OVERVIEW:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Website Type: Custom Business Website
Development Start: [PROJECT_START_DATE]
Launch Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Development Cost: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (30% of total cost)
Payment Schedule:
- 30% deposit upon signing
- 40% at design approval
- 30% upon project completion

SCOPE OF DEVELOPMENT:

1. DESIGN PHASE (Weeks 1-2):
   - Wireframe creation
   - Visual design mockups
   - User experience (UX) planning
   - Mobile responsive design
   - Client review and approval

2. DEVELOPMENT PHASE (Weeks 3-5):
   - Front-end development (HTML, CSS, JavaScript)
   - Back-end development and database setup
   - Content management system integration
   - Contact forms and functionality
   - Search engine optimization (SEO) basics

3. TESTING PHASE (Week 6):
   - Cross-browser compatibility testing
   - Mobile device testing
   - Performance optimization
   - Security implementation
   - Client training and handover

DELIVERABLES:
- Fully functional responsive website
- Content management system access
- Basic SEO optimization
- Google Analytics integration
- Contact form functionality
- 30 days of post-launch support
- Website documentation and training

HOSTING AND DOMAIN:
Client is responsible for hosting and domain costs. Developer can recommend hosting providers and assist with setup for additional fee.

CONTENT:
Client will provide all text content, images, and media. Developer can assist with content creation for additional fee. Stock photos may be used with appropriate licensing.

REVISIONS:
Two rounds of design revisions included. Additional revisions charged at $100 per hour. Scope changes may require contract amendment.

MAINTENANCE:
30 days of free support included. Ongoing maintenance available at $150/month including updates, backups, and security monitoring.

INTELLECTUAL PROPERTY:
Upon final payment, Client owns the website and all custom code. Developer retains rights to use general techniques and may showcase work in portfolio.

BROWSER COMPATIBILITY:
Website will be compatible with current versions of Chrome, Firefox, Safari, and Edge. Legacy browser support available for additional fee.

TIMELINE DEPENDENCIES:
Timeline depends on timely Client feedback and content provision. Delays in Client responses may extend delivery date.

WARRANTY:
Developer warrants website will be free from defects for 30 days post-launch. This warranty covers functionality, not design preferences.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Developer Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-12',
    lastModified: '2024-01-22',
    isDefault: true,
    category: 'web-development',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '5',
    name: 'Copywriting Contract',
    description: 'Content writing and marketing copy services',
    content: `COPYWRITING SERVICES AGREEMENT

This Copywriting Services Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional copywriting service ("Copywriter"), and [CLIENT_NAME] ("Client").

PROJECT DETAILS:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Content Type: Marketing Copy and Website Content
Start Date: [PROJECT_START_DATE]
Delivery Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Project Fee: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (50% of total fee)
Payment Terms: 50% deposit, 50% upon completion
Rush Jobs: 25% surcharge for projects with less than 5 business days notice

SCOPE OF COPYWRITING SERVICES:

1. WEBSITE COPY:
   - Homepage content (up to 800 words)
   - About page (up to 600 words)
   - Services/Products pages (up to 500 words each)
   - Contact page content
   - SEO-optimized meta descriptions

2. MARKETING MATERIALS:
   - Brochure copy (tri-fold or bi-fold)
   - Sales letter or direct mail piece
   - Email marketing campaigns (up to 5 emails)
   - Social media post templates (10 posts)
   - Press release (if applicable)

3. BLOG CONTENT:
   - 4 blog posts (800-1200 words each)
   - SEO keyword integration
   - Engaging headlines and subheadings
   - Call-to-action optimization

RESEARCH AND STRATEGY:
- Target audience analysis
- Competitor research
- Brand voice development
- Keyword research for SEO
- Content strategy recommendations

DELIVERABLES:
- All copy in Microsoft Word format
- SEO keyword recommendations
- Content style guide
- Social media content calendar
- Performance tracking suggestions

REVISION POLICY:
Three rounds of revisions included in base price. Additional revisions charged at $75 per hour. Major scope changes require new agreement.

CONTENT APPROVAL PROCESS:
1. Initial draft delivery
2. Client review and feedback (within 5 business days)
3. Revised draft based on feedback
4. Final approval and delivery

RESEARCH REQUIREMENTS:
Client will provide:
- Brand guidelines and existing materials
- Target audience information
- Competitor examples
- Product/service details
- Any specific requirements or preferences

USAGE RIGHTS:
Client receives full ownership and usage rights upon final payment. Copywriter retains right to use work samples in portfolio with Client's permission.

CONFIDENTIALITY:
All Client information and project details will be kept strictly confidential. Non-disclosure agreement available upon request.

TIMELINE:
- Week 1: Research and strategy development
- Week 2-3: First draft creation
- Week 4: Revisions and refinements
- Week 5: Final delivery and optimization

PERFORMANCE EXPECTATIONS:
While Copywriter will optimize content for engagement and conversions, specific performance results cannot be guaranteed as they depend on multiple factors beyond copy alone.

CANCELLATION:
Project may be cancelled with 48 hours written notice. Deposit is non-refundable. Client pays for work completed to cancellation date.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Copywriter Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-08',
    lastModified: '2024-01-19',
    isDefault: true,
    category: 'copywriting',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '6',
    name: 'Social Media Management Contract',
    description: 'Social media strategy and content management',
    content: `SOCIAL MEDIA MANAGEMENT AGREEMENT

This Social Media Management Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional social media management service ("Manager"), and [CLIENT_NAME] ("Client").

SERVICE OVERVIEW:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Service Type: Comprehensive Social Media Management
Contract Start: [PROJECT_START_DATE]
Contract End: [PROJECT_END_DATE]
Monthly Retainer: [PROJECT_PRICE]
Setup Fee: [PROJECT_DEPOSIT]

PLATFORMS MANAGED:
✓ Instagram (Business Account)
✓ Facebook (Business Page)
✓ Twitter/X (Business Profile)
✓ LinkedIn (Company Page)
✓ TikTok (Business Account) - Optional
✓ YouTube (Channel Management) - Optional

MONTHLY SERVICES INCLUDED:

1. CONTENT CREATION:
   - 20 custom posts per month (5 per platform)
   - Professional graphic design
   - Copywriting and hashtag research
   - Video content creation (2 per month)
   - Story content (15 stories per month)

2. COMMUNITY MANAGEMENT:
   - Daily monitoring and engagement
   - Response to comments and messages
   - Community building activities
   - Influencer outreach coordination
   - Crisis management support

3. STRATEGY AND PLANNING:
   - Monthly content calendar
   - Hashtag strategy development
   - Audience growth strategies
   - Competitor analysis
   - Campaign planning and execution

4. ANALYTICS AND REPORTING:
   - Monthly performance reports
   - Audience insights analysis
   - Engagement rate tracking
   - Growth metrics monitoring
   - ROI analysis and recommendations

CONTENT APPROVAL PROCESS:
- Content calendar provided by 25th of previous month
- Client has 48 hours to review and approve
- Emergency posts may be published without prior approval
- Brand guidelines must be provided for consistency

POSTING SCHEDULE:
- Instagram: Daily posts, 3-5 stories
- Facebook: 5 posts per week
- Twitter: 10 posts per week
- LinkedIn: 3 posts per week
- Optimal posting times based on audience analytics

BRAND GUIDELINES:
Client must provide:
- Logo files and brand colors
- Brand voice and tone guidelines
- Content do's and don'ts
- Industry-specific requirements
- Legal compliance requirements

PERFORMANCE EXPECTATIONS:
- 15-25% monthly follower growth (organic)
- 5-10% average engagement rate
- Increased website traffic from social
- Improved brand awareness metrics
- Enhanced customer engagement

ADDITIONAL SERVICES (Extra Cost):
- Paid advertising management (+$500/month)
- Influencer collaboration campaigns
- Professional photography/videography
- Website integration and optimization
- Email marketing integration

CONTENT OWNERSHIP:
Client owns all custom content created. Manager retains rights to use content for portfolio purposes. Stock images licensed appropriately.

CONFIDENTIALITY:
All Client business information kept confidential. Social media account access secured with two-factor authentication.

TERMINATION:
Either party may terminate with 30 days written notice. Final month's work will be completed. Account access transferred back to Client.

PAYMENT TERMS:
Monthly retainer due on 1st of each month. Late payments subject to $50 fee. Services may be suspended for accounts 15+ days overdue.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Manager Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-06',
    lastModified: '2024-01-17',
    isDefault: true,
    category: 'social-media',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '7',
    name: 'Illustration Contract',
    description: 'Custom illustrations and digital art services',
    content: `ILLUSTRATION SERVICES AGREEMENT

This Illustration Services Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional illustration studio ("Illustrator"), and [CLIENT_NAME] ("Client").

PROJECT INFORMATION:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Illustration Type: Custom Digital Illustrations
Project Start: [PROJECT_START_DATE]
Delivery Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Project Fee: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (40% of total fee)
Payment Schedule:
- 40% deposit upon signing
- 30% at sketch approval
- 30% upon final delivery

SCOPE OF ILLUSTRATION WORK:

1. CONCEPT DEVELOPMENT:
   - Initial consultation and brief review
   - Mood board creation
   - Style exploration
   - Concept sketches (3 initial concepts)
   - Client feedback and direction

2. SKETCH PHASE:
   - Detailed pencil sketches
   - Composition refinement
   - Character development (if applicable)
   - Technical specifications
   - Client approval required

3. FINAL ARTWORK:
   - Digital illustration creation
   - Color application and rendering
   - Detail refinement and polish
   - Quality assurance review
   - File preparation and delivery

DELIVERABLES:
- High-resolution final artwork (300 DPI minimum)
- Web-optimized versions (72 DPI)
- Vector files (if applicable)
- Multiple file formats (AI, EPS, PNG, JPG)
- Print-ready files with bleed
- Source files (additional fee)

ILLUSTRATION SPECIFICATIONS:
- Style: [To be determined in consultation]
- Dimensions: [To be specified]
- Color Mode: CMYK for print, RGB for digital
- Resolution: 300 DPI for print, 72 DPI for web
- File formats as specified above

REVISION POLICY:
- Unlimited revisions during sketch phase
- 2 rounds of revisions during final artwork phase
- Additional revisions: $100 per hour
- Major style changes may require new agreement

USAGE RIGHTS AND LICENSING:
- Client receives rights for specified usage
- Commercial usage rights included
- Exclusive rights available for additional fee
- Illustrator retains portfolio usage rights
- Copyright remains with Illustrator unless purchased

TIMELINE BREAKDOWN:
- Week 1: Concept development and initial sketches
- Week 2: Sketch refinement and approval
- Week 3-4: Final artwork creation
- Week 5: Revisions and final delivery

REFERENCE MATERIALS:
Client will provide:
- Detailed project brief
- Reference images or examples
- Brand guidelines (if applicable)
- Technical specifications
- Any specific requirements

APPROVAL PROCESS:
- Sketch approval required before proceeding
- Final approval required for completion
- All approvals must be in writing
- Verbal approvals not binding

CANCELLATION POLICY:
- Project may be cancelled at any phase
- Client pays for work completed to date
- Deposit non-refundable after sketch phase
- Cancellation must be in writing

INTELLECTUAL PROPERTY:
- Illustrator retains copyright unless purchased
- Client receives usage rights as specified
- No unauthorized reproduction permitted
- Credit to Illustrator appreciated but not required

FILE DELIVERY:
- Files delivered via secure digital transfer
- Physical delivery available for additional fee
- Backup copies maintained for 1 year
- Re-delivery of files: $50 fee

QUALITY GUARANTEE:
Illustrator guarantees professional quality work meeting industry standards. Any technical issues will be corrected at no charge.

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Illustrator Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-04',
    lastModified: '2024-01-16',
    isDefault: true,
    category: 'illustration',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '8',
    name: 'Music Production Contract',
    description: 'Audio production and music composition services',
    content: `MUSIC PRODUCTION AGREEMENT

This Music Production Agreement ("Agreement") is entered into on [CURRENT_DATE] between [BUSINESS_NAME], a professional music production studio ("Producer"), and [CLIENT_NAME] ("Client").

PROJECT DETAILS:
Project Title: [PROJECT_TITLE]
Project Description: [PROJECT_DESCRIPTION]
Production Type: Original Music Composition and Production
Recording Start: [PROJECT_START_DATE]
Delivery Date: [PROJECT_END_DATE]

FINANCIAL TERMS:
Total Production Fee: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT] (50% of total fee)
Payment Schedule:
- 50% deposit upon signing
- 25% at recording completion
- 25% upon final delivery

PRODUCTION SERVICES:

1. PRE-PRODUCTION:
   - Creative consultation and planning
   - Song arrangement and structure
   - Instrumentation planning
   - Recording schedule coordination
   - Equipment and studio preparation

2. RECORDING PHASE:
   - Professional studio recording
   - Multi-track recording capabilities
   - Live instrument recording
   - Vocal recording and comping
   - MIDI programming and sequencing

3. POST-PRODUCTION:
   - Audio editing and cleanup
   - Mixing and balance optimization
   - Mastering for final delivery
   - Quality control and review
   - File preparation and delivery

DELIVERABLES:
- Master recording (24-bit/96kHz WAV)
- CD-quality master (16-bit/44.1kHz WAV)
- MP3 versions (320kbps)
- Instrumental versions
- Individual stems (additional fee)
- MIDI files (if applicable)

STUDIO SPECIFICATIONS:
- Professional recording equipment
- Acoustically treated recording space
- Industry-standard software (Pro Tools, Logic Pro)
- High-quality microphones and preamps
- Monitoring on professional speakers

CREATIVE PROCESS:
- Initial consultation and vision discussion
- Demo creation and approval
- Recording session scheduling
- Real-time collaboration during recording
- Regular progress updates and previews

REVISION POLICY:
- Unlimited revisions during recording phase
- 3 rounds of mix revisions included
- 1 round of mastering revisions included
- Additional revisions: $150 per hour

RIGHTS AND ROYALTIES:
- Client owns master recording rights
- Producer retains production credit
- Publishing rights as negotiated separately
- Mechanical royalties (if applicable)
- Performance royalties (if applicable)

MUSICIAN AND TALENT:
- Session musicians provided as needed
- All performers properly credited
- Union scale rates for additional musicians
- Vocalist coaching included if needed
- Guest artist coordination available

TECHNICAL SPECIFICATIONS:
- Recording format: 24-bit/96kHz minimum
- Mixing format: 32-bit floating point
- Mastering: Industry-standard loudness levels
- File formats: WAV, AIFF, MP3 as requested
- Metadata embedding included

STUDIO TIME:
- Estimated 40 hours total studio time
- Additional time: $100 per hour
- Overtime rates apply after 8-hour sessions
- Studio time includes engineer and equipment
- Scheduling flexibility within reason

EQUIPMENT AND INSTRUMENTS:
- Full range of studio instruments available
- Vintage and modern equipment selection
- Specialized instruments by arrangement
- Client may bring own instruments
- Equipment maintenance and setup included

DELIVERY AND ARCHIVAL:
- Digital delivery via secure file transfer
- Physical media delivery (additional cost)
- Project files archived for 2 years
- Re-delivery of masters: $100 fee
- Backup and storage included

CANCELLATION POLICY:
- 30+ days notice: 50% refund of remaining balance
- 14-29 days notice: 25% refund
- Less than 14 days: No refund
- Completed work remains property of Client

CREDIT AND PROMOTION:
- Producer credit on all releases
- Permission to use excerpts for demo reel
- Social media promotion coordination
- Industry networking opportunities
- Award submission consideration

By signing below, both parties agree to the terms and conditions outlined in this Agreement.

Client Signature: _________________________ Date: _____________
[CLIENT_NAME]

Producer Signature: _________________________ Date: _____________
[BUSINESS_NAME]`,
    createdAt: '2024-01-03',
    lastModified: '2024-01-14',
    isDefault: true,
    category: 'music',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
];

export default function ContractTemplatesScreen() {
  const router = useRouter();
  const { canUseFeature, getCurrentPlan, upgradeTier, subscription } = useSubscriptionStore();
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const canUseContracts = canUseFeature('contracts');
  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid';
  const isStudioPlan = subscription.tier === 'top';
  
  // For Professional plan, limit to 5 custom templates (plus default templates)
  const customTemplates = templates.filter(t => !t.isDefault);
  const canCreateMoreTemplates = !isProPlan || customTemplates.length < 5 || isStudioPlan;

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      Alert.alert('Cannot Delete', 'Default templates cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTemplates(prev => prev.filter(t => t.id !== templateId));
          },
        },
      ]
    );
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    try {
      await upgradeTier(tier);
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };

  const handleNewTemplate = () => {
    if (!canUseContracts) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!canCreateMoreTemplates) {
      Alert.alert(
        'Template Limit Reached',
        'Professional plan allows up to 5 custom templates. Upgrade to Studio for unlimited templates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => setShowUpgradePrompt(true) }
        ]
      );
      return;
    }
    
    router.push('/new-template');
  };

  const handleDuplicateTemplate = (templateId: string) => {
    if (!canUseContracts) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!canCreateMoreTemplates) {
      Alert.alert(
        'Template Limit Reached',
        'Professional plan allows up to 5 custom templates. Upgrade to Studio for unlimited templates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => setShowUpgradePrompt(true) }
        ]
      );
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newTemplate: ContractTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };

    setTemplates(prev => [newTemplate, ...prev]);
    Alert.alert('Success', 'Template duplicated successfully!');
  };

  const renderTemplateCard = ({ item }: { item: ContractTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <View style={styles.templateTitleRow}>
            <Text style={styles.templateName} numberOfLines={1}>{item.name}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.templateDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.templateMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.templateDate}>
              Modified {new Date(item.lastModified).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/template-preview?id=${item.id}`)}
        >
          <Eye size={18} color={colors.text.secondary} />
          <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>Preview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/edit-template/${item.id}`)}
        >
          <Edit size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDuplicateTemplate(item.id)}
        >
          <Copy size={18} color={colors.secondary} />
          <Text style={[styles.actionButtonText, { color: colors.secondary }]}>Duplicate</Text>
        </TouchableOpacity>
        
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteTemplate(item.id)}
          >
            <Trash2 size={18} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Contract Templates" 
        showBackButton 
        rightElement={
          <Button
            title="New"
            onPress={handleNewTemplate}
            variant={canUseContracts && canCreateMoreTemplates ? "primary" : "outline"}
            size="small"
            leftIcon={canUseContracts && canCreateMoreTemplates ? <Plus size={16} color={colors.text.inverse} /> : <Lock size={16} color={colors.text.secondary} />}
          />
        }
      />

      {!canUseContracts ? (
        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedContent}>
            <Lock size={64} color={colors.text.tertiary} />
            <Text style={styles.restrictedTitle}>Contract Templates Unavailable</Text>
            <Text style={styles.restrictedDescription}>
              Contract templates are available on Professional and Studio plans. Create reusable templates to streamline your workflow.
            </Text>
            <Button
              title="Upgrade to Professional"
              onPress={() => setShowUpgradePrompt(true)}
              variant="primary"
              style={styles.upgradeButton}
            />
            <Text style={styles.planInfo}>
              Current plan: {currentPlan.name}
            </Text>
          </View>
        </View>
      ) : (
        <>
          {/* Template limit warning for Professional plan */}
          {isProPlan && (
            <View style={styles.limitWarning}>
              <Text style={styles.limitWarningText}>
                Professional plan: {customTemplates.length}/5 custom templates used
                {customTemplates.length >= 5 && ' • Upgrade to Studio for unlimited templates'}
              </Text>
            </View>
          )}
          
          {templates.length > 0 ? (
            <FlatList
              data={templates}
              keyExtractor={(item) => item.id}
              renderItem={renderTemplateCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState
              title="No templates yet"
              description="Create your first contract template to streamline your workflow."
              actionLabel="Create Template"
              onAction={handleNewTemplate}
              icon={<FileText size={32} color={colors.primary} />}
            />
          )}
        </>
      )}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        title={!canUseContracts ? "Unlock Contract Templates" : "Upgrade for Unlimited Templates"}
        description={!canUseContracts ? "Create reusable contract templates to streamline your workflow and maintain consistency." : "Professional plan limits you to 5 custom templates. Upgrade to Studio for unlimited templates."}
        suggestedTier={!canUseContracts ? "mid" : "top"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  templateCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateHeader: {
    marginBottom: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  templateDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.secondary,
    textTransform: 'capitalize',
  },
  templateDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  templateActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    gap: 6,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  restrictedContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  restrictedDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
  },
  planInfo: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  limitWarning: {
    backgroundColor: colors.warning + '10',
    borderWidth: 1,
    borderColor: colors.warning + '30',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  limitWarningText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
    textAlign: 'center',
  },
});