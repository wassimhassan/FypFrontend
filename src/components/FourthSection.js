import ReviewCard from "./ReviewCard"
import "./FourthSection.css"

const FourthSection = () => {
  return (
    <div className="fourth-section">
      <p className="subtitle">What People Say</p>
      <h2 className="title">Student Reviews</h2>
      <p className="section-description">
        Hear from our community of students who have benefited from our platform and achieved their educational goals.
      </p>

      <div className="review-cards">
        <ReviewCard
          name="Alex Thompson"
          description="This platform helped me find the perfect scholarship for my engineering degree. The resources are incredible and the support is outstanding!"
          image="/FekraLogo.png"
        />
        <ReviewCard
          name="Maria Rodriguez"
          description="Amazing experience! The career guidance and university recommendations were exactly what I needed to make informed decisions about my future."
          image="/FekraLogo.png"
        />
        <ReviewCard
          name="Omar Al-Rashid"
          description="The SAT prep courses and scholarship opportunities available here changed my life. I'm now studying at my dream university!"
          image="/FekraLogo.png"
        />
      </div>

      <button className="write-review-btn">Write a Review</button>
    </div>
  )
}

export default FourthSection
