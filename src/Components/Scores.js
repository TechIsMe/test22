const Scores = ({ score }) => {
    return (
      <div className="score-board">
        <button>
        <h2>{score}</h2>
        </button>
      </div>
    )
  }
  
  export default Scores;