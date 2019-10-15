function arraysOperations(arr1, arr2, op='sum') {
    let result = [],
        operation;

    switch(op) {
        case 'sum':
            operation = (a,b) => {return a+b};
            break;
    
        case 'res':
            operation = (a,b) => {return a-b};
            break;

        case 'mul':
            operation = (a,b) => {return a*b};
            break;

        case 'div':
            operation = (a,b) => {return a/b};
    }

    for(var i=0; i<arr1.length; i++) {
        result.push(operation(arr1[i],arr2[i]));
    }

    return result;
}

function perpVect(arr) {
    let aux;

    aux = arr[1];
    arr[1] = arr[0] * -1;
    arr[0] = aux;

    return arr;
}

function calculeNormals(shape) {
    let normals = [],
        centerNorm,
        shpVect,
        normVect;

    for(var i=0; i<shape.length-1; i++) {
        centerNorm = arraysOperations(
            arraysOperations(shape[i], shape[i+1], 'sum'),
            [2,2],
            'div'
        );

        shpVect = arraysOperations(
            arraysOperations(shape[i], [2,2], 'div'), 
            arraysOperations(shape[i+1], [2,2], 'div'), 
            'res'
        );

        normVect = arraysOperations(
            centerNorm,
            perpVect(shpVect),
            'res'
        );
        
        normals.push({
            'center': centerNorm,
            'vector': normVect
        });
    }

    return normals;
}