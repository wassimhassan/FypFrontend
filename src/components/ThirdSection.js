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
          name="Ibrahim Mohammad"
          description="Nursing Student at BAU."
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="Aljalilah"
          description="Physics Master at EMU."
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="Asmaa Shreih"
          description="Computer Science Bachelor AUB."
        />
      </div>
    </section>
  )
}

export default ThirdSection
