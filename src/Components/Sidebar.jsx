import { useEffect, useState } from 'react';

const fineTunedInstruction =
  "You will only answer the question based on the trained model. Just answer you don't have the information yet if there is no answer.";

const GPT_MODELS = [
  { name: 'gpt-4', value: 'gpt-4' },
  { name: 'gpt-3.5-turbo-1106', value: 'gpt-3.5-turbo-1106' },
  {
    name: 'gpt-3.5-turbo-1106:fine_tune_aftercare_faq',
    value: 'ft:gpt-3.5-turbo-1106:personal::8iPOKvoB',
  },
];

export default function Sidebar({ initialParams, onChangeParams }) {
  const [params, setParams] = useState({
    system: initialParams.system,
    model: initialParams.model,
    temperature: initialParams.temperature,
    maxToken: initialParams.maxToken,
  });

  const closebtn = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = 'none';
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setParams({ ...params, [name]: value });

    let instructions = 'You are a helpful assistant.';

    if (name === 'model' && value.includes('ft')) {
      setParams((params) => ({ ...params, system: fineTunedInstruction }));
    } else if (name === 'model' && !value.includes('ft')) {
      setParams((params) => ({
        ...params,
        system: instructions,
      }));
    }
  };

  useEffect(() => {
    onChangeParams(params);
  }, [params]);

  return (
    <div className="sidebar" id="sidebar">
      <div>
        <a className="close-btn" onClick={closebtn}>
          &#10006;
        </a>
        <div className="mb-3">
          <label className="form-label">System</label>
          <textarea
            name="system"
            onChange={onChange}
            value={params.system}
            rows={15}
            className="form-control"
            placeholder="You are a helpful assistant."
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Model</label>
          <select
            name="model"
            onChange={onChange}
            value={params.model}
            className="form-control"
          >
            {GPT_MODELS.map((model, i) => (
              <option key={i} value={model.value}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Temperature</label>
          <span className="ml-3">{params.temperature}</span>
          <input
            name="temperature"
            onChange={onChange}
            value={params.temperature}
            className="form-control-range"
            type="range"
            min={0.1}
            max={2}
            step={0.1}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Length</label>
          <span className="ml-3">{params.maxToken}</span>
          <input
            name="maxToken"
            onChange={onChange}
            value={params.maxToken}
            className="form-control-range"
            type="range"
            min={1}
            max={4000}
          />
        </div>
      </div>
    </div>
  );
}
