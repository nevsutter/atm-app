/**
 * PIN Processor Service
 * Handles PIN validation
 */ 

const invalidInputText = "Input is invalid";

/**
 * validatePIN
 * Calls remote service to validate PIN
 * 
 * @param {*} value The PIN to validate
 * @returns Promise -> {Integer} User's balance if PIN is valid
 * @throws Error with response code if PIN not valid
 */
export async function validatePIN (value) {
  
  if (isNaN(value)) {
    throw new Error(invalidInputText);
  }

  const url = "https://frontend-challenge.screencloud-michael.now.sh/api/pin";
  
  const body = { 
    "pin": `${value}`
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
  }

  let response = await fetch(url, options);

  if (!response.ok) {
    //console.log(`validatePIN failed:  ${response.status} - ${response.statusText}`);
    throw new Error(response.status);
  } else {
    let responseBody = await response.json();

    if (responseBody.currentBalance
      && !isNaN(responseBody.currentBalance)) {
        // For now assume whole numbers only
        return parseInt(responseBody.currentBalance);
    } else {
      // Invalid response, throw server error
      //console.log(`validatePIN failed:  Invalid response`);
      throw new Error(500);
    }
  }
}
