document.getElementById('submitButton').addEventListener('click', async function (event) {
  console.log("Event listener triggered");
  event.preventDefault();

  const formData = new FormData(document.getElementById('eventCreatorNft'));

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    //window.location.href = '/sellerInterface';
    //console.log('Upload successful:', result.uri);
    //window.location.href = '/sellerInterface';
  } catch (error) {
    console.error('Error:', error);
  }
});
