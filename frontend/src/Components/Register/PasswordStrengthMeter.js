import React from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ password }) => {
  const testResult = zxcvbn(password);
  const num = (testResult.score * 100) / 4;

  const progressCoulor = () => {
    switch(testResult.score) {
        case 0:
            return '#828282';
        case 1:
            return '#EA1111';
        case 2: 
            return '#FFAD00';
        case 3: 
            return '#9bc158';
        case 4:
            return '#00b500';
        default:
            return 'none'
    }
  }

  const createPasswordLable = () => {
    switch(testResult.score) {
        case 0:
            return 'Very Weak';
        case 1:
            return 'Weak';
        case 2: 
            return 'Fair';
        case 3: 
            return 'Good';
        case 4:
            return 'Strong';
        default:
            return 'none';
    }
  }

  const changePasswordColour = () => ({
    width: `${num}%`,
    background: progressCoulor(),
    height: "7px",
  });
  // lower, upper, numbers, symbols <= rules

  return (
    <>
      <div className="progress" style={{ height: "7px", width: '90%', marginLeft: '6%'}}>
        <div className="progress-bar" style={changePasswordColour()}></div>
      </div>
      <p style={{ color: progressCoulor(), fontSize: '12px', marginLeft: '75%' }}>{createPasswordLable()}</p>
    </>
  );
};

export default PasswordStrengthMeter;