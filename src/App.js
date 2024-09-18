import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle, Sparkles, Camera, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

const models = {
  aida: {
    title: "AIDA model",
    questions: [
      { key: "attention", label: "Attention: What first caught your attention about the product?" },
      { key: "interest", label: "Interest: What made you interested in learning more about it?" },
      { key: "desire", label: "Desire: What made you want the product?" },
      { key: "action", label: "Action: What led you to actually make the purchase?" },
    ],
  },
  cdm: {
    title: "Consumer decision-making process",
    questions: [
      { key: "problemRecognition", label: "Problem recognition: What need or problem were you addressing?" },
      { key: "informationSearch", label: "Information search: How did you search for options?" },
      { key: "informationEvaluation", label: "Information evaluation: How did you compare alternatives?" },
      { key: "decision", label: "Decision: What made you choose that product?" },
      { key: "postPurchaseEvaluation", label: "Post-purchase evaluation: How do you feel about your purchase now?" },
    ],
  },
};

const JourneyMap = ({ answers, productName, model, onReset }) => {
  const stages = models[model].questions;
  const mapRef = useRef(null);

  const takeScreenshot = () => {
    if (mapRef.current) {
      html2canvas(mapRef.current, {
        backgroundColor: null,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-journey-map.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full bg-blue-100 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">{productName} purchase decision-making journey</h3>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div 
              key={stage.key} 
              className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg"
            >
              <h4 className="font-bold text-lg mb-2 text-blue-600">{stage.label.split(':')[0]}</h4>
              <p className="text-gray-700">{answers[stage.key]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={takeScreenshot}
          className="px-6 py-3 rounded-full bg-green-500 text-white font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
        >
          <Camera className="mr-2" /> Take Screenshot
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-full bg-yellow-500 text-white font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center"
        >
          <RotateCcw className="mr-2" /> Start Over
        </button>
      </div>
    </div>
  );
};

const PurchaseDecisionJourney = () => {
  const [model, setModel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [productName, setProductName] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [animateSparkle, setAnimateSparkle] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < models[model].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setModel(null);
    setCurrentQuestion(0);
    setAnswers({});
    setProductName('');
    setIsComplete(false);
  };

  useEffect(() => {
    setAnimateSparkle(true);
    const timer = setTimeout(() => setAnimateSparkle(false), 1000);
    return () => clearTimeout(timer);
  }, [answers, productName]);

  const currentQuestionData = model ? models[model].questions[currentQuestion] : null;

  return (
    <div className="w-full bg-blue-100 min-h-screen py-8">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-50 rounded-lg shadow-2xl min-h-[800px] flex flex-col">
          <div className="flex-grow flex flex-col justify-center p-8">
            {!model && (
              <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-inner mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Choose Your Model</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {Object.entries(models).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setModel(key)}
                      className="px-6 py-3 rounded-full bg-yellow-300 text-gray-700 font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    >
                      {value.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {model && !isComplete && (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product name"
                    className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white bg-opacity-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition duration-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-inner">
                  <h2 className="text-2xl font-bold mb-4 text-gray-700">{currentQuestionData.label}</h2>
                  <textarea
                    name={currentQuestionData.key}
                    value={answers[currentQuestionData.key] || ''}
                    onChange={handleInputChange}
                    placeholder="Type your answer here"
                    className="w-full p-4 border-2 border-blue-300 rounded-lg bg-white bg-opacity-50 text-gray-700 focus:outline-none focus:border-yellow-400 transition duration-300 h-32 resize-none"
                  />
                </div>

                <div className="flex justify-between">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 rounded-full bg-blue-300 text-gray-700 font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!answers[currentQuestionData.key]?.trim()}
                    className="px-6 py-3 rounded-full bg-yellow-300 text-gray-700 font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === models[model].questions.length - 1 ? (
                      <>
                        Complete <CheckCircle className="inline-block ml-2" />
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="inline-block ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {isComplete && (
              <JourneyMap answers={answers} productName={productName} model={model} onReset={handleReset} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDecisionJourney;

