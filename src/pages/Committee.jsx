import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, GraduationCap, ArrowLeft, Star, Monitor, Share2, Palette, ClipboardList, Truck, IdCard, Video, MessageSquare, DollarSign, Award, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Committee.css';

// --- DATA ---
// --- DATA ---
const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const CONVENERS = [
    {
        name: "Dr. Trushit Upadhyaya",
        role: "Principal, CSPIT",
        designation: null,
        image: "/images/members/1.Convener/Trushit sir -1.jpeg",
        icon: <Star size={16} />
    },
    {
        name: "Dr. Upesh Patel",
        role: "HOD, EC-CSPIT",
        designation: null,
        image: "/images/members/1.Convener/upeshPatel.jpg",
        icon: <Award size={16} />
    },
    {
        name: 'Dr. Arpita Patel',
        role: 'Associate Professor, EC-CSPIT',
        designation: null,
        image: "/images/members/1.Convener/arpita maam-3.jpeg",
        icon: <Star size={16} />
    }
];

const COORDINATORS = [
    {
        name: 'Dr. Arpita Patel',
        role: 'Associate Professor, EC-CSPIT',
        designation: null,
        image: "/images/members/1.Convener/arpita maam-3.jpeg",
        icon: <Star size={16} />
    }
];

const FACULTY_CO_COORDINATORS = [
    { name: 'Dr. Jitendra Chaudhari', role: 'Professor, EC-CSPIT', designation: null, image: null, icon: <Users size={16} /> },
    { name: 'Dr. Hardik Modi', role: 'Associate Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/7. hardik sir.WEBP", icon: <ClipboardList size={16} /> },
    { name: 'Dr. Killol Pandya', role: 'Associate Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/2. killol sir.WEBP", icon: <Award size={16} /> },
    { name: 'Dr. Sagar Patel', role: 'Associate Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/1. sagar sir.WEBP", icon: <Share2 size={16} /> },
    { name: 'Dr. Dharmendra Chauhan', role: 'Associate Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/6. dharmwndra sir.WEBP", icon: <Share2 size={16} /> },
    { name: 'Dr. Manthan Manavadaria', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/manthan sir.WEBP", icon: <Award size={16} /> },
    { name: 'Dr. Poonam Thanki', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/5. poonam maam.WEBP", icon: <Palette size={16} /> },
    { name: 'Dr. Brijesh Kundaliya', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/8. brijesh sir.jpeg", icon: <Monitor size={16} /> },
    { name: 'Dr. Miral Desai', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/3. miral sir.WEBP", icon: <Monitor size={16} /> },
    { name: 'Dr. Dhara Patel', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/dhara patel.WEBP", icon: <Palette size={16} /> },
    { name: 'Dr. Kanwar Preet Kaur', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/kanwar maam.WEBP", icon: <MessageSquare size={16} /> },
    { name: 'Dr. Tigmashu Patel', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/tigmanshu sir.WEBP", icon: <Share2 size={16} /> },
    { name: 'Prof. Vishal Shah', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/2.faculty coordinators/10. vishal sir.WEBP", icon: <DollarSign size={16} /> },
    { name: 'Dr. Mayur Makwana', role: 'Assistant Professor, EC-CSPIT', designation: null, image: null, icon: <ClipboardList size={16} /> },
    { name: 'Prof. Akshaya Patel', role: 'Assistant Professor, EC-CSPIT', designation: null, image: null, icon: <MessageSquare size={16} /> },
    { name: 'Prof. Dhara Pomal', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/dhara pomal.jpg", icon: <Palette size={16} /> },
    { name: 'Prof. Dhruvika Sonar', role: 'Assistant Professor, EC-CSPIT', designation: null, image: "/images/members/3.faculty co-coordinators/dhruvika maam.jpeg", icon: <Video size={16} /> },
    { name: 'Prof. Niral Yagnik', role: 'Assistant Professor, EC-CSPIT', designation: null, image: null, icon: <ClipboardList size={16} /> },
    { name: 'Prof. Parth Chauhan', role: 'Assistant Professor, EC-CSPIT', designation: null, image: null, icon: <Award size={16} /> }
];

const CORE_LEADS = [
    { name: 'Dhruti Panchal', role: null, designation: 'Core Head', image: "/images/members/4.core_committee/Dhruti-1.jpg", icon: <Palette size={16} /> },
    { name: 'Dhruv Rupapara', role: null, designation: 'Core Head', image: "/images/members/4.core_committee/Feedback, Reporting & Continuity Committee/Dhruv_Ruppapara.JPG", icon: <Star size={16} /> },
];

const CORE_COMMITTEE = [
    { name: 'Kushal Pitaliya', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Website Committee/Kushal_Pitaliya.jpg", icon: <Monitor size={16} /> },
    { name: 'Man Bhimani', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Core Organizing Committee/Man_Bhimani.jpg", icon: <DollarSign size={16} /> },
    { name: 'Mahi Kansagara', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Mahi_Kansagara.jpeg", icon: <ClipboardList size={16} /> },
    { name: 'Katyayani Hukeri', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Core Organizing Committee/Katyayani_Hukeri.jpg", icon: <Users size={16} /> },
    { name: 'Shlok Patel', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Core Organizing Committee/Shlok_Patel.jpeg", icon: <Video size={16} /> },
    { name: 'Minaxi Dalsania', role: null, designation: 'Coordinator', image: "/images/members/4.core_committee/Core Organizing Committee/Minaxi_Dalsania.jpeg", icon: <ClipboardList size={16} /> }
];

const STUDENT_COORDINATORS = [
    // Year 3
    { name: 'Shlok Shah', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Poster Review Committee/Shlok_Shah.png", icon: <Video size={16} /> },
    { name: 'Mohit Rathod', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Poster Review Committee/Mohit_Rathod.jpg", icon: <Share2 size={16} /> },
    { name: 'Bhaumik Soni', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Registration, Help Desk & Attendance Committee/Bhaumik_soni.jpg", icon: <ClipboardList size={16} /> },
    { name: 'Arya Vyas', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Registration, Help Desk & Attendance Committee/Arya_Vyas.jpg", icon: <ClipboardList size={16} /> },
    { name: 'Riddhi Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Website Committee/Riddhi_Patel.jpg", icon: <Monitor size={16} /> },
    { name: 'Yashvi Brahmbhatt', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Website Committee/Yashvi_Brahmbhatt.jpg", icon: <Monitor size={16} /> },
    { name: 'Om Savani', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Website Committee/Om_savani.jpeg", icon: <Monitor size={16} /> },
    
    // Year 2
    { name: 'Jal Lathia', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Jal_Lathia.PNG", icon: <Palette size={16} /> },
    { name: 'Brinda Varsani', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Brinda_Varsani.jpg", icon: <Palette size={16} /> },
    { name: 'Darshana Nasit', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Feedback, Reporting & Continuity Committee/Nasit_Darshana.jpg", icon: <MessageSquare size={16} /> },
    { name: 'Srushti Jasoliya', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Stationery, ID & Merchandise Committee/Srushti_Jasoliya.jpg", icon: <IdCard size={16} /> },
    { name: 'Nency Prajapati', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Sponsorship, Publicity & Outreach Committee/Nency_Prajapati.jpg", icon: <Share2 size={16} /> },
    { name: 'Yashvi Kankotiya', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Registration, Help Desk & Attendance Committee/Yashvi_Kankotiya.jpg", icon: <ClipboardList size={16} /> },
    { name: 'Vritika Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Sponsorship, Publicity & Outreach Committee/Vritika_Patel.jpg", icon: <Share2 size={16} /> },
    { name: 'Vishva Amin', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Vishva_Amin.jpg", icon: <Palette size={16} /> },
    { name: 'Tathya Bhatt', role: null, designation: 'Co-Coordinator', image: "/images/student coordinator/2.Tathya.jpg", icon: <Award size={16} /> },
    { name: 'Nihar Thumbar', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Sponsorship, Publicity & Outreach Committee/Nihar_Thumbar.jpg", icon: <Share2 size={16} /> },
    { name: 'Maitry Shah', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Food & Transportation Committee/Maitri_Shah.jpg", icon: <Truck size={16} /> },
    { name: 'Khanjan Shah', role: null, designation: 'Co-Coordinator', image: null, icon: <IdCard size={16} /> },
    { name: 'Jitendra Prajapati', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Technical Program  Stage & Logistics Committee/Prajapati_Jitendra.jpg", icon: <Award size={16} /> },
    { name: 'Disha Italiya', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Italiya_Disha.jpeg", icon: <Palette size={16} /> },
    { name: 'Yug Shah', role: null, designation: 'Co-Coordinator', image: null, icon: <Award size={16} /> },
    
    // Year 1
    { name: 'Harianshinh Rana', role: null, designation: 'Co-Coordinator', image: null, icon: <Palette size={16} /> },
    { name: 'Harshdutt Joshi', role: null, designation: 'Co-Coordinator', image: null, icon: <Palette size={16} /> },
    { name: 'Hetvi Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Registration, Help Desk & Attendance Committee/hetvi_patel.jpeg", icon: <ClipboardList size={16} /> },
    { name: 'Jeet Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Food & Transportation Committee/Jeet Patel.jpg", icon: <Truck size={16} /> },
    { name: 'Saumy Mehta', role: null, designation: 'Co-Coordinator', image: null, icon: <Palette size={16} /> },
    { name: 'Saurya Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Sponsorship, Publicity & Outreach Committee/Saurya_Patel.jpg", icon: <Share2 size={16} /> },
    { name: 'Yatri Patel', role: null, designation: 'Co-Coordinator', image: "/images/members/4.core_committee/Decoration & Volunteer Committee/Yatri_Patel.jpg", icon: <Palette size={16} /> }
];

const TeamMemberCard = ({ member }) => (
    <div className="team-card">
        <div className="card-image-container">
            <div className="card-image-wrapper">
                {member.image ? (
                    <img src={member.image} alt={member.name} />
                ) : (
                    <div className="placeholder-avatar">
                        <span className="initials">{member.name.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className="card-badge">
                {member.icon || <User size={14} />}
            </div>
        </div>

        <div className="card-content">
            <h3 className="card-name">{member.name}</h3>
            {member.role && (
                <div className="card-role-badge">
                    {member.role.toUpperCase()}
                </div>
            )}
            {member.designation && (
                <p className="card-designation">{member.designation}</p>
            )}
        </div>
    </div>
);

const Committee = () => {
    const [activeTab, setActiveTab] = useState('Conveners');

    const tabs = [
        'Conveners',
        'Coordinator',
        'Faculty Co-Coordinators',
        'Core Committee',
        'Student Coordinators'
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case 'Conveners': return CONVENERS;
            case 'Coordinator': return COORDINATORS;
            case 'Faculty Co-Coordinators': return FACULTY_CO_COORDINATORS;
            case 'Core Committee': return CORE_COMMITTEE;
            case 'Student Coordinators': return STUDENT_COORDINATORS;
            default: return [];
        }
    };

    return (
        <div className="team-page">
            <Navbar />

            {/* Hero */}
            <section className="team-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={25} />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="team-hero-content">
                        <span className="section-tag">The Organizers</span>
                        <h1>Excellence In <span className="text-gradient">Action</span></h1>
                        <p>
                            Meet the visionaries and executors behind Semiconductor Summit 2.0.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="team-tabs-section">
                <div className="team-section-bg">
                    <div className="team-section-grid" />
                    <div className="team-section-glow team-section-glow-1" />
                    <div className="team-section-glow team-section-glow-2" />
                    <div className="team-section-glow team-section-glow-3" />
                </div>
                <div className="container">
                    <div className="team-tabs-wrapper">
                        <div className="team-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`team-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="team-grid-container">
                        {activeTab === 'Core Committee' ? (
                            <>
                                {/* Core Leads - Top Tier */}
                                <div className="core-leads-section">
                                    <div className="core-leads-label">Core Head</div>
                                    <div className="team-grid core-leads-grid">
                                        {CORE_LEADS.map((member, index) => (
                                            <div key={`lead-${index}`} className="team-grid-item core-lead-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <TeamMemberCard member={member} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="core-divider">
                                    <div className="core-divider-line" />
                                    <span className="core-divider-text">Coordinator</span>
                                    <div className="core-divider-line" />
                                </div>

                                {/* Rest of Core Committee */}
                                <div className="team-grid">
                                    {CORE_COMMITTEE.map((member, index) => (
                                        <div key={`core-${index}`} className="team-grid-item" style={{ animationDelay: `${(index + 2) * 0.04}s` }}>
                                            <TeamMemberCard member={member} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="team-grid" key={activeTab}>
                                {getActiveData().map((member, index) => (
                                    <div key={`${activeTab}-${index}`} className="team-grid-item" style={{ animationDelay: `${index * 0.04}s` }}>
                                        <TeamMemberCard member={member} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Committee;
