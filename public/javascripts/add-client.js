function handleAddClient(){
    $('#js-add-client').on("submit", event => {
        event.preventDefault();
        console.log('`handleAddClient` ran');
      }); 
}
  
  $(handleAddClient);