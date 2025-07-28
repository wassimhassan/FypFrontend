import InfoCard from "./InfoCard"
import "./SecondSection.css"

const SecondSection = () => {
  return (
    <section className="second-section">
      <p className="subtitle">Why Choose Us</p>
      <h2 className="main-title">Our Values</h2>
      <p className="section-description">
        Discover what makes our platform unique and how we're committed to empowering students with the best educational
        opportunities and resources.
      </p>

      <div className="info-cards-container">
        <InfoCard
          image="/logo1.png"
          title="Accessible Opportunities"
          description="We bring all our programs, scholarships, and workshops together in one place — no more missed chances or scattered updates."
        />
        <InfoCard
          image="/logo2.png"
          title="Student-Centered Content"
          description="Every feature is designed to support students' growth — from SAT prep to career guidance — with curated, high-quality material."
        />
        <InfoCard
          image="/logo3.png"
          title="Impact-Driven Tracking"
          description="Our event calendar, registration system, and learning tools help students stay on track and measure their own progress clearly."
        />
      </div>
    </section>
  )
}

export default SecondSection
