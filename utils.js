
var shader_vertex_source;
var shader_fragment_source;

function initShader(shader_vertex, shader_fragment){
    shader_vertex_source = shader_vertex;
    shader_fragment_source = shader_fragment;
}


function generateElips2(radius, sectorCount, stackCount, factorX, factorY, factorZ, moveX,moveY,moveZ, c1,c2,c3){
    console.log(shader_vertex_source, shader_fragment_source); //hapus nanti
    elipsHead_vertex = [];
    elipsHead_faces = [];
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (let i = 0; i <= stackCount; ++i)
    {
        let titik_x, titik_y, titik_z, xy;

        stackAngle = Math.PI / 2 - i * stackStep;      
        xy = radius * Math.cos(stackAngle);       
        titik_z = factorZ * radius * Math.sin(stackAngle);         

        for (let j = 0; j <= sectorCount; ++j)
        {
            sectorAngle = j * sectorStep;         

            // vertex position (x, y, z)
            titik_x = factorX * xy * Math.cos(sectorAngle);   // r * cos(u) * cos(v)
            titik_y = factorY * xy * Math.sin(sectorAngle);   // r * cos(u) * sin(v)
            elipsHead_vertex.push(titik_x+moveX);
            elipsHead_vertex.push(titik_y+moveY);
            elipsHead_vertex.push(titik_z+moveZ); 
            elipsHead_vertex.push(c1/255);
            elipsHead_vertex.push(c2/255);
            elipsHead_vertex.push(c3/255);      
            }
        }

        var k1, k2;
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if (i != 0) {
                    elipsHead_faces.push(k1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k1 + 1);
                }35                    // k1+1 => k2 => k2+1
                if (i != (stackCount - 1)) {
                    elipsHead_faces.push(k1 + 1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k2 + 1);
                }
            }
        }
    var object = new MyObject(elipsHead_vertex,elipsHead_faces,shader_vertex_source,shader_fragment_source);
    return object;
};
//factorx,y,z: ini untuk lonjongin x,y,z; 
//moveX,Y,Z: ini untuk pindahin posisi x,y,z (untuk mindahin posisi ne misal mata di tengah2 muka, jadi  dicoba pixel e dimana :((   )))
//c1,c2,c3: ini untuk warna dibuat /255 supaya bisa langsung RGB    
function createElips(radius, sectorCount, stackCount, factorX, factorY, factorZ, moveX,moveY,moveZ, c1,c2,c3){
    elipsHead_vertex = [];
    elipsHead_faces = [];
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (let i = 0; i <= stackCount; ++i)
    {
        let titik_x, titik_y, titik_z, xy;

        stackAngle = Math.PI / 2 - i * stackStep;      
        xy = radius * Math.cos(stackAngle);       
        titik_z = factorZ * radius * Math.sin(stackAngle);         

        for (let j = 0; j <= sectorCount; ++j)
        {
            sectorAngle = j * sectorStep;         

            // vertex position (x, y, z)
            titik_x = factorX * xy * Math.cos(sectorAngle);   // r * cos(u) * cos(v)
            titik_y = factorY * xy * Math.sin(sectorAngle);   // r * cos(u) * sin(v)
            elipsHead_vertex.push(titik_x+moveX);
            elipsHead_vertex.push(titik_y+moveY);
            elipsHead_vertex.push(titik_z+moveZ); 
            elipsHead_vertex.push(c1);
            elipsHead_vertex.push(c2);
            elipsHead_vertex.push(c3);      
            }
        }

        var k1, k2;
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if (i != 0) {
                    elipsHead_faces.push(k1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k1 + 1);
                }35                    // k1+1 => k2 => k2+1
                if (i != (stackCount - 1)) {
                    elipsHead_faces.push(k1 + 1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k2 + 1);
                }
            }
        }
    return [elipsHead_vertex, elipsHead_faces];
};



function createElipPara(radius, sectorCount, stackCount, factorX, factorY, factorZ, moveX,moveY,moveZ, c1,c2,c3){
    var elipPara_vertex = [];
    var elipPara_faces = [];
    var x, y, z, xy;                              // vertex position
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (let i = 0; i <= stackCount/2; ++i)
    {
        
        stackAngle = Math.PI / 2 - i * stackStep;        // starting from pi/2 to -pi/2
        xy = radius * Math.cos(stackAngle);             // r * cos(u)
        z = factorZ * radius * Math.sin(stackAngle);              // r * sin(u)
    
        // add (sectorCount+1) vertices per stack
        // first and last vertices have same position and normal, but different tex coords
        for (let j = 0; j <= sectorCount; ++j)
        {
            
            sectorAngle = j * sectorStep;           // starting from 0 to 2pi
    
            // vertex position (x, y, z)
            x = factorX * xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
            y = factorY * xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)   
            elipPara_vertex.push(x);
            elipPara_vertex.push(y);
            elipPara_vertex.push(z);
            elipPara_vertex.push(c1,c2,c3);                   
        }
    }
    for (let index = 0; index < elipsHead_vertex.length; index+=6) {
        elipPara_vertex[index] += moveX;
        elipPara_vertex[index+1] += moveY;
        elipPara_vertex[index+2] += moveZ;
    }
    var k1, k2;
    for (let i = 0; i < stackCount; ++i) {
        k1 = i * (sectorCount + 1);     // beginning of current stack
        k2 = k1 + sectorCount + 1;      // beginning of next stack
    
        for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            // 2 triangles per sector excluding first and last stacks
            // k1 => k2 => k1+1
            if (i != 0) {
                elipPara_faces.push(k1);
                elipPara_faces.push(k2);
                elipPara_faces.push(k1 + 1);
            }
    
            // k1+1 => k2 => k2+1
            if (i != (stackCount - 1)) {
                elipPara_faces.push(k1 + 1);
                elipPara_faces.push(k2);
                elipPara_faces.push(k2 + 1);
            }
        }
    }
    return [elipPara_vertex, elipPara_faces];
};

function generateElipPara2(radius, sectorCount, stackCount, factorX, factorY, factorZ, moveX,moveY,moveZ, c1,c2,c3){
    var elipPara_vertex = [];
    var elipPara_faces = [];
    var x, y, z, xy;                              // vertex position
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (let i = 0; i <= stackCount/2; ++i)
    {
        
        stackAngle = Math.PI / 2 - i * stackStep;        // starting from pi/2 to -pi/2
        xy = radius * Math.cos(stackAngle);             // r * cos(u)
        z = factorZ * radius * Math.sin(stackAngle);              // r * sin(u)
    
        // add (sectorCount+1) vertices per stack
        // first and last vertices have same position and normal, but different tex coords
        for (let j = 0; j <= sectorCount; ++j)
        {
            
            sectorAngle = j * sectorStep;           // starting from 0 to 2pi
    
            // vertex position (x, y, z)
            x = factorX * xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
            y = factorY * xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)   
            elipPara_vertex.push(x);
            elipPara_vertex.push(y);
            elipPara_vertex.push(z);
            elipPara_vertex.push(c1/255,c2/255,c3/255);                   
        }
    }
    for (let index = 0; index < elipsHead_vertex.length; index+=6) {
        elipPara_vertex[index] += moveX;
        elipPara_vertex[index+1] += moveY;
        elipPara_vertex[index+2] += moveZ;
    }
    var k1, k2;
    for (let i = 0; i < stackCount; ++i) {
        k1 = i * (sectorCount + 1);     // beginning of current stack
        k2 = k1 + sectorCount + 1;      // beginning of next stack
    
        for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            // 2 triangles per sector excluding first and last stacks
            // k1 => k2 => k1+1
            if (i != 0) {
                elipPara_faces.push(k1);
                elipPara_faces.push(k2);
                elipPara_faces.push(k1 + 1);
            }
    
            // k1+1 => k2 => k2+1
            if (i != (stackCount - 1)) {
                elipPara_faces.push(k1 + 1);
                elipPara_faces.push(k2);
                elipPara_faces.push(k2 + 1);
            }
        }
    }

    var object = new MyObject(elipPara_vertex,elipPara_faces,shader_vertex_source,shader_fragment_source);
    return object;
};

function createTabung(r, xUp, yUp, zOrigin, zUp, c1,c2,c3, vertex,faces){
    for (let index = 0; index <= 360; index++) {
        var x = r * Math.cos(LIBS.degToRad(index));
        var y = r * Math.sin(LIBS.degToRad(index));
        vertex.push(x+xUp);
        vertex.push(y+yUp);
        vertex.push(zOrigin);
        vertex.push(c1/255,c2/255,c3/255);      
    }
    vertex.push(xUp,yUp,zOrigin+zUp, c1,c2,c3);
    for (let index = 0; index <= 360; index++) {
        var x = r * Math.cos(LIBS.degToRad(index));
        var y = r * Math.sin(LIBS.degToRad(index));
        vertex.push(x+xUp);
        vertex.push(y+yUp); 
        vertex.push(zOrigin + zUp);
        vertex.push(c1/255,c2/255,c3/255);      
    }

    var faces = [];
    for (let index = 0; index <= 360; index++) {
        faces.push(0,index, index+1);
    }
    for (let index = 362; index <= 722; index++) {
        faces.push(362,index, index+1);
    }
    for (let index = 0; index <= 360; index++) {
        faces.push(index+361, index, index+362);
    }
    for (let index = 0; index <= 360; index++) {
        faces.push(index+362, index+1, index);
    }
    return [vertex, faces];
};

var generateCone = function (mX1, mY1, mZ1, mX2, mY2, mZ2, rX1, rY1, r, g, b) {
    var cone_vertex = [];
    var cone_faces = [];

    cone_vertex.push(mX1, mY1, mZ1);
    cone_vertex.push(r / 255, g / 255, b / 255);
    for (var i = 0; i <= 360; i++) {
        var radian = i / Math.PI;
        var x = rX1 * Math.cos(radian);
        var y = rY1 * Math.sin(radian);
        cone_vertex.push(x + mX2, y + mY2, mZ2);
        cone_vertex.push(r / 255, g / 255, b / 255);
    }

    for (var i = 0; i < 360; i++) {
        cone_faces.push(0, i, i + 1);
    }  
    
    var object = new MyObject(cone_vertex,cone_faces,shader_vertex_source,shader_fragment_source);
    return object;
}

function generateTabung(initX, initY, initZ, depth, r, c1,c2,c3, count){
    var objects = [];
    for (let index = 0; index < count; index++) {
        var pangkalKiri_vertex = [];
        var pangkalKiri_faces = [];
        var temp = createTabung(r, initX,initY, initZ, depth, c1,c2,c3, pangkalKiri_vertex, pangkalKiri_faces);
        pangkalKiri_vertex = temp[0];
        pangkalKiri_faces = temp[1];
        var object1 = new MyObject(pangkalKiri_vertex, pangkalKiri_faces, shader_vertex_source, shader_fragment_source);      
        objects.push(object1);  
        // initX+=incX;
        // initY+=incY;
        // initZ+=incZ;
    }
    return object1;
};


function generateBiggerStraight(initX, initY, initZ, depth, r,incR, c1,c2,c3, count){
    var objects = [];
    for (let index = 0; index < count; index++) {
        var pangkalKiri_vertex = [];
        var pangkalKiri_faces = [];
        var temp = createTabung(r, initX,initY, initZ, depth, c1,c2,c3, pangkalKiri_vertex, pangkalKiri_faces);
        r+=incR;
        initZ-=depth;
        pangkalKiri_vertex = temp[0];
        pangkalKiri_faces = temp[1];
        var object1 = new MyObject(pangkalKiri_vertex, pangkalKiri_faces, shader_vertex_source, shader_fragment_source);      
        objects.push(object1); 
    }
    return objects;
};

function customTabung(r, xUp, yUp, zOrigin, zUp, c1,c2,c3, vertex,faces, factorX, factorY){
    for (let index = 0; index <= 360; index++) {
        var x = factorX * r * Math.cos(LIBS.degToRad(index));
        var y = factorY * r * Math.sin(LIBS.degToRad(index));
        vertex.push(x+xUp);
        vertex.push(y+yUp);
        vertex.push(zOrigin);
        vertex.push(c1,c2,c3);      
    }
    vertex.push(xUp,yUp,zOrigin+zUp, c1,c2,c3);
    for (let index = 0; index <= 360; index++) {
        var x = factorX * r * Math.cos(LIBS.degToRad(index));
        var y = factorY * r * Math.sin(LIBS.degToRad(index));
        vertex.push(x+xUp);
        vertex.push(y+yUp); 
        vertex.push(zOrigin + zUp);
        vertex.push(c1,c2,c3);      
    }

    var faces = [];
    for (let index = 0; index <= 360; index++) {
        faces.push(0,index, index+1);
    }
    for (let index = 362; index <= 722; index++) {
        faces.push(362,index, index+1);
    }
    for (let index = 0; index <= 360; index++) {
        faces.push(index+361, index, index+362);
    }
    for (let index = 0; index <= 360; index++) {
        faces.push(index+362, index+1, index);
    }
    return [vertex, faces];
};

function generateHalfElips2(radius, sectorCount, stackCount, factorX, factorY, factorZ, moveX,moveY,moveZ, c1,c2,c3){
    elipsHead_vertex = [];
    elipsHead_faces = [];
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (let i = 0; i <= stackCount/2; ++i)
    {
        let titik_x, titik_y, titik_z, xy;

        stackAngle = Math.PI / 2 - i * stackStep;      
        xy = radius * Math.cos(stackAngle);       
        titik_z = factorZ * radius * Math.sin(stackAngle);         

        for (let j = 0; j <= sectorCount; ++j)
        {
            sectorAngle = j * sectorStep;         

            // vertex position (x, y, z)
            titik_x = factorX * xy * Math.cos(sectorAngle);   // r * cos(u) * cos(v)
            titik_y = factorY * xy * Math.sin(sectorAngle);   // r * cos(u) * sin(v)
            elipsHead_vertex.push(titik_x+moveX);
            elipsHead_vertex.push(titik_y+moveY);
            elipsHead_vertex.push(titik_z+moveZ); 
            elipsHead_vertex.push(c1/255);
            elipsHead_vertex.push(c2/255);
            elipsHead_vertex.push(c3/255);      
            }
        }

        var k1, k2;
        for (let i = 0; i < stackCount; ++i) {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if (i != 0) {
                    elipsHead_faces.push(k1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k1 + 1);
                }35                    // k1+1 => k2 => k2+1
                if (i != (stackCount - 1)) {
                    elipsHead_faces.push(k1 + 1);
                    elipsHead_faces.push(k2);
                    elipsHead_faces.push(k2 + 1);
                }
            }
        }
    var object = new MyObject(elipsHead_vertex,elipsHead_faces,shader_vertex_source,shader_fragment_source);
    return object;
};