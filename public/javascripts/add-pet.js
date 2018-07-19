function handleAddPet(){
    $('#js-add-pet').on("submit", event => {
        event.preventDefault();
        console.log('`handleAddPet` ran');
      }); 
}
  
  $(handleAddPet);