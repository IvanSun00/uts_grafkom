function main(){
    var CANVAS = document.getElementById('mycanvas');

    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    //drag and wasd move
    var drag = false;
    var x_prev, y_prev;
    var dX = 0, dY = 0;
    var THETA = 0, PHI = 0;
    var AMORTIZATION = 0.8;

    var keyDown = function (e) {
        drag = true;
        if (e.key == "a" | e.key == "A" | e.key == "ArrowLeft") {
            dX = -0.02;
            dY = 0;
            THETA += dX;
            x_prev = e.pageX;
        }
        if (e.key == "d" | e.key == "D" | e.key == "ArrowRight") {
            dX = 0.02;
            dY = 0;
            THETA += dX;
            x_prev = e.pageX;
        }
        if (e.key == "w" | e.key == "W" | e.key == "ArrowDown") {
            dY = -0.02;
            dX = 0;
            PHI += dY;
            y_prev = e.pageY;
        }
        if (e.key == "s" | e.key == "S" | e.key == "ArrowUp") {
            dY = 0.02;
            dX = 0;
            PHI += dY;
            y_prev = e.pageY;
        }
        return false;
    };
    var keyPress = function (e) {
        drag = true;
        if (e.key == "ArrowLeft") {
            dX = -0.02;
            dY = 0;
            THETA += dX;
            x_prev = e.pageX;
        }
        if (e.key == "ArrowRight") {
            dX = 0.02;
            dY = 0;
            THETA += dX;
            x_prev = e.pageX;
        }
        if (e.key == "ArrowDown") {
            dY = -0.02;
            dX = 0;
            PHI += dY;
            y_prev = e.pageY;
        }
        if (e.key == "ArrowUp") {
            dY = 0.02;
            dX = 0;
            PHI += dY;
            y_prev = e.pageY;
        }
        return false;

    };
    var keyUp = function (e) {
        drag = false;
        return false;

    };

    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);
    window.addEventListener("keypress", keyPress, false);

    var mouseDown = function (e) {
        drag = true;
        x_prev = e.pageX;
        y_prev = e.pageY;
        e.preventDefault();
        return false;
    };
    var mouseUp = function (e) {
        drag = false;
    };
    var mouseMove = function (e) {
        if (!drag) {
            return false;
        }
        dX = 15* (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = 15* (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX;
        y_prev = e.pageY;
        e.preventDefault();
    }

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false); 
    CANVAS.addEventListener("mouseout", mouseUp, false); 
    CANVAS.addEventListener("mousemove", mouseMove, false);
    //drag and wasd move end

    //INISIALISASI
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch {
        alert("WebGL context cannot be initialized");
        return false;
    }

    //SHADERS
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;

    varying vec3 vColor;
    void main(void){
        gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
        gl_PointSize = 20.0;
        vColor = color;
    }
    `
    var shader_fragment_source = `
        precision mediump float;
        varying vec3 vColor;
        void main(void){
            gl_FragColor = vec4(vColor,1.0);
        }
    `
    initShader(shader_vertex_source, shader_fragment_source); //ini untuk init karena beda file dan diluar scope
    
    //buat object2 untuk jigglypuff
    var headluar = generateElips2(
        1.2, 36, 18, 
        1.8, 1.3, 1.2, 
        0,0,0, 
        245,217,226
    );
    var right_eye = generateElipPara2(
        0.32, 36, 18, 
        1.0, 1.0, 0.5,
        0.55,0.3,1.4, 
        0, 131, 147
    );
    var right_eye_outer = generateElipPara2(
        0.45, 36, 18, 
        1.0, 1.0, .5, 
        0.55,0.3,1.3,
        255, 255,255
    );

    var left_eye = generateElipPara2(
        0.32, 36, 18, 
        1.0, 1.0, 0.5,
        -0.55,0.3,1.4, 
        0, 131, 147
    );
    var left_eye_outer = generateElipPara2(
        0.45, 36, 18, 
        1.0, 1.0, 0.5, 
        -0.55,0.3,1.3,
        255, 255,255
    );

    var right_hand = generateElipPara2(
        0.3, 36, 18, 
        1.0, 1.0, 4.5, 
        1.2,-0.6,1.2,
        227, 171, 181
    );

    var left_hand = generateElipPara2(
        0.3, 36, 18, 
        1.0, 1.0, 6.5, 
        -1.5,-0.6,0.5,
        227, 171, 181
    );

    var right_leg = generateElips2(
        0.3, 36, 18, 
        1.0, 1.0, 2.4, 
        0.5,-1.6,0.6,
        227, 171, 181
    );

    var left_leg = generateElips2(
        0.3, 36, 18, 
        1.0, 1.0, 2.4, 
        -0.5,-1.6,0.6,
        227, 171, 181
    );

    var right_ear_outer = generateElipPara2(
        0.55, 36, 18, 
        1.2, 0.7, 2.0, 
        0.7,0.4, 1.25,
        227, 171, 181
    );

    var right_ear = generateElipPara2(
        0.35, 36, 18, 
        1.3, 0.5, 1.7, 
        0.7,0.2, 1.65,
        0, 0, 0
    );

    var left_ear_outer = generateElipPara2(
        0.55, 36, 18, 
        1.2, 0.7, 2.0, 
        -0.7,0.4, 1.25,
        227, 171, 181
    );

    var left_ear = generateElipPara2(
        0.35, 36, 18, 
        1.3, 0.5, 1.7, 
        -0.7,0.2, 1.65,
        0, 0, 0
    );

    var batang_pencil = generateTabung(
        -2.0, 1.25, 0.1, 
        1.2, 0.08,
        0, 0, 0,
        15
    );

    var pucuk_pencil = generateCone(
        -2.0, 1.25, -0.3, 
        -2.0, 1.25, 0.1, 
        0.15,0.15,
        0,0,0  
    );   


    var curve = [-0.1,0.0, 0.1,-0.2, 0.3,0];
    // yStart = -0.4;
    // for (let index = 0; index < 4; index++) {
        var line_vertex = bezier.generateBSpline(curve,100,2, -0.1,-0.4,1.4);
        var line_faces = [];
        for (let index = 0; index < line_vertex.length/6; index++) {
            line_faces.push(index);
        }
        var mouth = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
        // yStart += 0.005;
        line.push(mouth);
    // }

    
    //setelah definisi semua object, panggil object utama disini
    var jigglypuff = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    jigglypuff.addChilds([headluar]);
    jigglypuff.addChilds([right_eye_outer]);
    jigglypuff.addChilds([left_eye_outer]);
    jigglypuff.addChilds([right_hand]);
    jigglypuff.addChilds([left_hand]);
    jigglypuff.addChilds([right_leg]);
    jigglypuff.addChilds([left_leg]); 
    jigglypuff.addChilds([mouth]);
    jigglypuff.addChilds([right_ear_outer]);
    jigglypuff.addChilds([left_ear_outer]);
    left_hand.addChilds([batang_pencil, pucuk_pencil]);
    left_eye_outer.addChilds([left_eye]);
    right_eye_outer.addChilds([right_eye]);
    left_ear_outer.addChilds([left_ear]);
    right_ear_outer.addChilds([right_ear]);



    //MATRIX
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEWMATRIX = LIBS.get_I4(); 

    LIBS.translateZ(VIEWMATRIX, -8);

    //DRAWING
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    GL.clearDepth(1.0);

    var time_prev = 0;
    var mat4 = glMatrix.mat4.create(); //
    for (let index = 0; index < mat4.length-(mat4.length/4); index++) {
        if (mat4[index]!= 1) {
            continue;
        }
        mat4[index] *= 0.5;
    }


    

    var maxTranslation = 0.5; // Maksimum jarak translasi dari pusat (dalam unit)
    var period = 3000; // Periode gerakan (dalam milidetik)
    var animate = function (time) {
        function walking(){
            let period2 = 2000;
            let maxTranslation2 = 0.3; 

                left_leg.setRotate(
                    Math.sin((( time % period2) / period2) * Math.PI * 2) *
                maxTranslation2,
                Math.cos((( time % period2) / period2) * Math.PI) *
                -0.08,
                    0
                )

                right_leg.setRotate(
                    -Math.sin((( time % period2) / period2) * Math.PI * 2) *
                maxTranslation2,
                Math.cos((( time % period2) / period2) * Math.PI) *
                0.08,
                0
                )
        }

        function lambai(){
            left_hand.setRotate(
                Math.sin((( time % period) / period) * Math.PI * 2) *
                maxTranslation,
                0,
                0
            )
        }

        if (time > 1000) {
            var dt = time - time_prev;
            if (!drag) {
                dX *= AMORTIZATION;
                dY *= AMORTIZATION;
                THETA += dX;
                PHI += dY;
            }
            jigglypuff.setRotateMove(PHI, THETA, 0); 

            // if(time > 2000 && time < 3000){
            //     jigglypuff.setScale(0.99);
            //     jigglypuff.setTranslateMove(0,0,-0.1)
            // }
            // if(time > 3000 && time < 4000){
            //     jigglypuff.setRotate(0,-2,0)
            // }
            // if(time > 4000 && time < 5000){
            //     jigglypuff.setTranslateMove(0,0,0.1)
            // }
            // if(time > 5000 && time < 6000){
            //     jigglypuff.setRotate(0,2,0)
            //     jigglypuff.setScale(1.01);
            // }
            walking();
            lambai();

            


        

           
                
            time_prev = time;
        }
        // eye

        glMatrix.mat4.rotateX(right_hand.MOVEMATRIX, right_hand.MOVEMATRIX, LIBS.degToRad(20));
        glMatrix.mat4.rotateY(right_hand.MOVEMATRIX, right_hand.MOVEMATRIX, LIBS.degToRad(30));     
    
        glMatrix.mat4.rotateX(left_hand.MOVEMATRIX, left_hand.MOVEMATRIX, LIBS.degToRad(-20));
        glMatrix.mat4.rotateY(left_hand.MOVEMATRIX, left_hand.MOVEMATRIX, LIBS.degToRad(-30));
        
        glMatrix.mat4.rotateX(right_ear_outer.MOVEMATRIX, right_ear_outer.MOVEMATRIX, LIBS.degToRad(-60));
        glMatrix.mat4.rotateY(right_ear_outer.MOVEMATRIX, right_ear_outer.MOVEMATRIX, LIBS.degToRad(30));
        glMatrix.mat4.rotateX(right_ear.MOVEMATRIX, right_ear.MOVEMATRIX, LIBS.degToRad(-60));
        glMatrix.mat4.rotateY(right_ear.MOVEMATRIX, right_ear.MOVEMATRIX, LIBS.degToRad(30));
        

        glMatrix.mat4.rotateX(left_ear_outer.MOVEMATRIX, left_ear_outer.MOVEMATRIX, LIBS.degToRad(-60));
        glMatrix.mat4.rotateY(left_ear_outer.MOVEMATRIX, left_ear_outer.MOVEMATRIX, LIBS.degToRad(-30));
        glMatrix.mat4.rotateX(left_ear.MOVEMATRIX, left_ear.MOVEMATRIX, LIBS.degToRad(-60));
        glMatrix.mat4.rotateY(left_ear.MOVEMATRIX, left_ear.MOVEMATRIX, LIBS.degToRad(-30));

        glMatrix.mat4.rotateX(batang_pencil.MOVEMATRIX, batang_pencil.MOVEMATRIX, LIBS.degToRad(90));
        glMatrix.mat4.rotateY(batang_pencil.MOVEMATRIX, batang_pencil.MOVEMATRIX, LIBS.degToRad(-10));
        
        glMatrix.mat4.rotateX(pucuk_pencil.MOVEMATRIX, pucuk_pencil.MOVEMATRIX, LIBS.degToRad(90));
        glMatrix.mat4.rotateY(pucuk_pencil.MOVEMATRIX, pucuk_pencil.MOVEMATRIX, LIBS.degToRad(-10));
        

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        jigglypuff.setuniformmatrix4(PROJMATRIX, VIEWMATRIX);
        jigglypuff.draw();
        jigglypuff.setIdentityMove();

        GL.flush();
        window.requestAnimationFrame(animate);
    }
    animate()
}

window.addEventListener('load', main);