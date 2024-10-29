const TimeRangeSelector = ({ onRangeChange }) => (
  <div className="time-range-selector">
    <button onClick={() => onRangeChange('1D')}>1D</button>
    <button onClick={() => onRangeChange('1W')}>1W</button>
    <button onClick={() => onRangeChange('1M')}>1M</button>
    <button onClick={() => onRangeChange('3M')}>3M</button>
    <button onClick={() => onRangeChange('1Y')}>1Y</button>
  </div>
);
