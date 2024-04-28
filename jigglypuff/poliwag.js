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
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
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
    
    var left_eye = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    //buat object2 untuk jigglypuff
    var badanluar = generateElips2(
        3.5, 36, 18, 
        1.2, 1.2, 1.2, 
        0,0,0, 
        91, 132, 181
    );
    var badandalam = generateElips2(
        1, 36, 18, 
        2, 2, 1, 
        0,-0.7,3.5, 
        227, 234, 243
    );

    // var udel1 = generateElipPara2(
    //     0.25, 36, 18, 
    //     1.5, 1.5, 1.5, 
    //     0,-1.5,4.3,
    //     255, 153, 153
    // );

    // var udel2 = generateElips2(
    //     0.1, 36, 18, 
    //     1.5, 1.5, 1.5, 
    //     0,-1.5,4.55, 
    //     255, 204, 204
    // );

    var curve = [-0.1, -2, -1, -2, -2, 0.1, 1.6, 0.3, 1, -1.7, -0.6, -1.8, -1.2, -0.4, -0.6, 0, 1.3, -0.1, 1, -1.3, 0, -1.6, -0.8, -1, -0.5, -0.1, 0.9, -0.2, 0.9, -1.2, -0.5, -1, -0.1, -0.5];
    yStart = 0;
    for (let index = 0; index < 4; index++) {
        var line_vertex = bezier.generateBSpline(curve,100,2, 0,yStart,4.5);
        var line_faces = [];
        for (let index = 0; index < line_vertex.length/2; index++) {
            line_faces.push(index);
        }
        var spiral = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
        yStart += 0.005;
        line.push(spiral);
    }

    var left_eye_outer = generateElipPara2(
        0.4, 36, 18, 
        1.5, 1.5, 1.5, 
        0.97,1.8,3.3,
        255, 255,255
    );
    var right_eye_outer = generateElipPara2(
        0.4, 36, 18, 
        1.5, 1.5, 1.5, 
        -0.97,1.8,3.3,
        255, 255,255
    );
    var left_eye = generateElips2(
        0.2, 36, 18, 
        1.5, 1.5, 1.5, 
        1,1.85,3.7, 
        0, 0, 0
    );
    var right_eye = generateElips2(
        0.2, 36, 18, 
        1.5, 1.5, 1.5, 
        -1,1.85,3.7, 
        0, 0, 0
    );

    var mulut = generateElips2(
        0.1, 36, 18, 
        6, 5, 5.5, 
        0,0.9,4, 
        240, 193, 194
    );

    var curve = [-0.05,-0.05, 0.0,0.0, 0.15,-0.05];
    yStart = 0.75;
    for (let index = 0; index < 4; index++) {
        var line_vertex = bezier.generateBSpline(curve,100,2, -0.05,yStart,4.53);
        var line_faces = [];
        for (let index = 0; index < line_vertex.length/6; index++) {
            line_faces.push(index);
        }
        var smile = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
        yStart += 0.005;
        line.push(smile);
    }

    var kaki_kanan = generateTabung(
        2.75, -2.95, 1.35,
        2.5, 0.45,
        51, 132, 190,
        15
    );

    var kaki_kiri = generateTabung(
        -2.75, -2.95, 1.35,
        2.5, 0.45,
        51, 132, 190,
        15
    );

    // var ekor = generateCone(
    //     1.5, //x bawah
    //     -8,    //y bawah
    //     1,    //z bawah
    //     0, // x atas
    //     -2,    // y atas
    //     0,    // z atas (atur tinggi)
    //     1, //radX
    //     1, //radY
    //     51, 132, 190
    // );

    var ekor_luar = generateElips2(
        1, 36, 18, 
        2, 3.5, 0, 
        0,-5,-2, 
        208, 219, 238
    );
    
    //setelah definisi semua object, panggil object utama disini
    var poliwag = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    poliwag.addChilds([badanluar, badandalam]);
    poliwag.addChilds([left_eye]);
    poliwag.addChilds([right_eye]);
    poliwag.addChilds([right_eye_outer]);
    poliwag.addChilds([left_eye_outer]);
    poliwag.addChilds([mulut, smile]);
    poliwag.addChilds([kaki_kanan, kaki_kiri]);
    poliwag.addChilds([ekor_luar]);
    poliwag.addChilds([spiral]);
    //MATRIX
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEWMATRIX = LIBS.get_I4(); 

    LIBS.translateZ(VIEWMATRIX, -35);

    //DRAWING
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    GL.clearDepth(1.0);

    var time_prev = 0;
    var mat4 = glMatrix.mat4.create();
    for (let index = 0; index < mat4.length-(mat4.length/4); index++) {
        if (mat4[index]!= 1) {
            continue;
        }
        mat4[index] *= 0.5;
    }

    var time_start = Date.now();
    var maxTranslationKaki = 0.09;
    var maxTranslationEkor = 0.09;
    var maxTranslationMata = 0.09;
    var period =200;

    var animate = function (time) {
        if (time > 0) {
            var dt = time - time_prev;
            if (!drag) {
                dX *= AMORTIZATION;
                dY *= AMORTIZATION;
                THETA += dX;
                PHI += dY;
            }
            poliwag.setRotateMove(PHI, THETA, 0);
            // poliwag.setTranslateMove(1, 0.001, 0);
            time_prev = time;        
        }

        glMatrix.mat4.rotateX(
            ekor_luar.MOVEMATRIX,
            ekor_luar.MOVEMATRIX,
            LIBS.degToRad(-35)
        );

        if(time>0&&time<1000)
        {
            poliwag.setScale(1.01);
        }
        
        poliwag.setRotate(0, 0.5, 0)

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var elapsedTime = Date.now() - time_start;

        // var translationMata = 
        // Math.sin(((elapsedTime % period) / period) * Math.PI * 2) *
        // maxTranslationMata;
        // right_eye.setTranslateMove(translationMata, translationMata, 0)

        var translationEkor =
        Math.sin(((elapsedTime % period) / period) * Math.PI * 2) *
        maxTranslationEkor;
        ekor_luar.setTranslateMove(translationEkor,0, 0); 

        var translationKakiKanan =
        Math.sin(((elapsedTime % period) / period) * Math.PI * 2) *
        maxTranslationKaki;
        kaki_kanan.setTranslateMove(0,0, translationKakiKanan); 

        var translationKakiKiri =
        Math.sin(((elapsedTime % period) / period) * Math.PI * 2) *
        maxTranslationKaki;
        kaki_kiri.setTranslateMove(0,translationKakiKiri, 0);

        poliwag.setRotateMove(1, 0, 0)

        poliwag.setuniformmatrix4(PROJMATRIX, VIEWMATRIX);
        poliwag.draw();
        poliwag.setIdentityMove();

        GL.flush();
        window.requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('load', main);