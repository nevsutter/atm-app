/**
 * Keypad Component
 * Generates numerical and action buttons
 * Calls respective actions from props
 */
import React from 'react';
import './index.css';

function ActionButton({action, onClick}) {
  return (
    <button 
      className={`action${action}`} 
      onClick={onClick}
    >
      {action}
    </button>
  );
}

function NumericalButton({numeral, onClick}) {
  return (
    <button 
      className={`numeral${numeral}`}
      onClick={onClick}
    >
      {numeral}
    </button>
  );
}

export default class Keypad extends React.Component {
  render() {
    const numerals = [1,2,3,4,5,6,7,8,9,0];

    const numericButtons = numerals.map(numeral => {
      return (
        <NumericalButton 
          key={numeral}
          numeral={numeral}
          onClick={() => this.props.onNumberClick(numeral)}
        />
      );
    });

    return (
      <div className="keypad">
        <div className="numericButtons">{numericButtons}</div>
        <div className="actionButtons">
          <ActionButton
            action="Clear"
            onClick={this.props.onClearClick}
          />
          <ActionButton
            action="Cancel"
            onClick={this.props.onCancelClick}
          />
          <ActionButton
            action="Enter"
            onClick={this.props.onEnterClick}
          />
        </div>
      </div>
    );
  }
}