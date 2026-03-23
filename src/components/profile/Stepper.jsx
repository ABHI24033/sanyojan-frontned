import "./profile.css";

export default function Stepper({ currentStep }) {
  return (
    <div className="form-wizard-header w-100 overflow-auto py-3">
      <ul className="list-unstyled d-flex justify-content-start form-wizard-list position-relative w-100">
        {[1, 2, 3, 4].map((num, index) => (
          <li
            key={num}
            className={`form-wizard-list__item w-100 justify-content-center
              ${currentStep > num ? "activated" : ""} 
              ${currentStep === num ? "active" : ""}
            `}
          >
            {/* Line only between items  ${currentStep === num ? "active" : ""}*/}
            {index !== 0 && <div className="connector-line"></div>}

            <div className="circle">
              <span className="count">{num}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


