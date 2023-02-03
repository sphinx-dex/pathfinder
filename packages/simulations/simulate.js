function getOutput(input, reserveInput, reserveOutput) {
  return reserveOutput - ((reserveInput * reserveOutput) / (reserveInput + (input * 0.997)));
}

const reserveA = 1600
const reserveB = 1

const inAmount = 50

const orders = [
  {
    price: 1540,
    amount: 0.001
  },
  {
    price: 1550,
    amount: 0.001
  },
  {
    price: 1600,
    amount: 0.001
  },
  {
    price: 1600,
    amount: 0.01
  },
  {
    price: 1640,
    amount: 0.001
  },
  {
    price: 1680,
    amount: 0.001
  },
  {
    price: 1850,
    amount: 0.001
  },
]

function runSimulation() {
  const sortedOrders = orders.sort((a, b) => a.price - b.price)
  console.log(sortedOrders)

  const ammOut = getOutput(inAmount, reserveA, reserveB);

  const selectedOrders = [];

  let remainingInput = inAmount;
  let bestOutput = ammOut;
  let currentOrderOutput = 0;
  console.log({ammOut})

  for (const order of orders) {
    const orderCost = order.price * order.amount;
    if (orderCost > remainingInput) {
      break;
    }

    const ammOut = getOutput(remainingInput - orderCost, reserveA, reserveB);

    const output = currentOrderOutput + order.amount + ammOut;
    console.log({orderCost, ammOut, output})

    if (output > bestOutput) {
      selectedOrders.push(order);
      remainingInput -= orderCost;
      bestOutput = output;
      currentOrderOutput += order.amount;
    } else {
      break;
    }
  }

  const price = inAmount / bestOutput;

  console.log({ price, ammOut, selectedOrders, bestOutput, currentOrderOutput, remainingInput })
}

runSimulation()
