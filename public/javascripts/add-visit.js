function handleAddVisit(){
    $('#js-add-visit').on("submit", event => {
        event.preventDefault();
        console.log('`handleAddVisit` ran');
      }); 
}
  
  $(handleAddVisit);