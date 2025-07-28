import "./ThirdSection.css"
import ProfileCardWelcomepage from "./ProfileCardWelcomepage"

const ThirdSection = () => {
  return (
    <section className="third-section">
      <p className="subtitle">Key People</p>
      <h2 className="title">Meet Our Teachers</h2>
      <p className="section-description">
        Get to know our dedicated educators who are committed to helping students achieve their academic and career
        goals.
      </p>

      <div className="profile-card-container">
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="Dr. Sarah Johnson"
          description="Mathematics & SAT Prep specialist with 10+ years of experience helping students excel in standardized tests."
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="Prof. Ahmed Hassan"
          description="Career counselor and university admissions expert, guiding students through their educational journey."
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="Ms. Emily Chen"
          description="Scholarship advisor and academic mentor, helping students find and secure funding opportunities."
        />
      </div>
    </section>
  )
}

export default ThirdSection
