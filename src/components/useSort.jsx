

function useSort(array = [], sortBy = '') {

    const copiedArray = [...array];

    switch (sortBy) {
      case 'high to low':
        return copiedArray.sort((a, b) => b.price - a.price);

      case 'low to high':
        return copiedArray.sort((a, b) => a.price - b.price);

      case 'a to z':
        return copiedArray.sort((a, b) => a.title.localeCompare(b.title));

      case 'z to a':
        return copiedArray.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return copiedArray;
    }
 

}

export default useSort;
