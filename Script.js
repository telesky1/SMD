const number = document.getElementById('number');
const inputField = document.getElementById('inputField');
const result = document.getElementById('result');
const radioButtons = document.querySelectorAll('input[name="resistorType"]');
const container = document.getElementById('container');
const img = document.getElementById('image');

// 预加载图片
const preloadImage = new Image();
preloadImage.src = img.src;

preloadImage.onload = () => {
  // 图片加载完成后显示容器
  container.style.display = 'flex';
  adjustFontSize();
  window.addEventListener('resize', adjustFontSize);
};

function adjustFontSize() {
  const imgWidth = img.clientWidth;
  number.style.fontSize = (imgWidth * 0.15) + 'px';
  result.style.fontSize = (imgWidth * 0.10) + 'px';
}

function calculateResistance(value) {
  let resistance = 0;
  const selectedType = document.querySelector('input[name="resistorType"]:checked').value;

  if (value.includes('R')) {
    const parts = value.split('R');
    const baseValue = parseInt(parts[0]) || 0;
    const decimalValue = parseInt(parts[1]) || 0;
    resistance = baseValue + (decimalValue / Math.pow(10, parts[1]?.length || 1));
  } else {
    if (selectedType === '3') {
      const digits = value.split('');
      const multiplier = parseInt(digits[2]) || 0;
      resistance = (parseInt(digits[0] + digits[1]) || 0) * Math.pow(10, multiplier);
    } else if (selectedType === '4') {
      const digits = value.split('');
      const multiplier = parseInt(digits[3]) || 0;
      resistance = (parseInt(digits[0] + digits[1] + digits[2]) || 0) * Math.pow(10, multiplier);
    }
  }
  return resistance;
}

function convertResistance(resistance) {
  if (resistance >= 1e6) {
    return (resistance / 1e6).toFixed(2) + ' MΩ';
  } else if (resistance >= 1e3) {
    return (resistance / 1e3).toFixed(2) + ' KΩ';
  }
  return resistance + ' Ω';
}

inputField.addEventListener('input', () => {
  const value = inputField.value.toUpperCase().replace(/[^0-9R]/g, '');
  const maxLength = document.querySelector('input[name="resistorType"]:checked').value;
  inputField.value = value.slice(0, maxLength);
  number.textContent = inputField.value;

  if (inputField.value.length === parseInt(maxLength)) {
    const resistance = calculateResistance(inputField.value);
    result.textContent = '阻值: ' + convertResistance(resistance);
  } else {
    result.textContent = '阻值: ';
  }
});

radioButtons.forEach(button => {
  button.addEventListener('change', () => {
    inputField.value = '';
    number.textContent = '';
    result.textContent = '阻值: ';
    inputField.setAttribute('maxlength', button.value);
  });
});