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
        dX = 15 * (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = 15 * (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
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
    //===== SNORLAX TITIK =====//
    {
      var muka = generateElips2(
        1.0,
        36,
        18,
        1.7,
        1.2,
        1,
        0,
        0,
        0,
        96,
        152,
        172
        );
        var muka_dalam = generateElips2(
        1.15,
        36,
        18,
        1.0,
        0.68,
        1.0,
        0,
        -0.08,
        0.2,
        236,
        226,
        213
        );
        var telinga_kiri = generateElipPara2 (
        0.7,
        36,
        18,
        0.7,
        1.5,
        0.4,
        -0.9,
        0.8,
        0.2,
        33,
        94,
        116
        ) ;
        var telinga_kanan = generateElipPara2 (
        0.7,
        36,
        18,
        0.7,
        1.5,
        0.4,
        0.9,
        0.8,
        0.2,
        33,
        94,
        116
        ) ;
    
        //-----------------ALIS-------------//
        var curve = [-0.1, 0.05, -0.15, 0.12, -0.3, 0.16];
        yStart = 0.05;
        for (let index = 0; index < 4; index++) {
            var line_vertex = bezier.generateBSpline(curve,100,2, -0.08,yStart,1.3);
            var line_faces = [];
            for (let index = 0; index < line_vertex.length/6; index++) {
                line_faces.push(index);
            }
            var alisKiri = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
            yStart += 0.005;
            alis.push(alisKiri);
        }
    
        curve = [0.1, 0.05, 0.15, 0.12, 0.3, 0.16];
        yStart = 0.05;
        for (let index = 0; index < 4; index++) {
            var line_vertex = bezier.generateBSpline(curve,100,2, -0.08,yStart,1.3);
            var line_faces = [];
            for (let index = 0; index < line_vertex.length/6; index++) {
                line_faces.push(index);
            }
            var alisKanan = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
            yStart += 0.005;
            alis.push(alisKanan);
        }
    
        // ---------- MULUT ---------- //
        curve = [-0.3, -0.35, -0.25, -0.4, -0.25, -0.35, 0.3, -0.35, 0.25, -0.4, 0.3, -0.35,];
        yStart = 0;
        for (let index = 0; index < 8; index++) {
            var line_vertex = bezier.generateBSpline(curve,100,2,0,yStart,1.3);
            var line_faces = [];
            for (let index = 0; index < line_vertex.length/6; index++) {
                line_faces.push(index);
            }
            var mulut = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
            yStart += 0.005;
            arrMulut.push(mulut);
        }
          
        //-----------------BADAN -------------//
        var badan = generateElips2(
        1.5,
        36,
        18,
        1.4,
        1.3,
        1.2,
        0.1,
        0,
        2,
        41,
        116,
        145);
    
        var badan_dalam = generateElips2(
        1.5,
        36,
        18,
        1,
        0.9,
        0.7,
        0.1,
        -2,
        1.2,
        241, 
        229,
        216);
    
        //-----------------TANGAN KANAN -------------//
        var tangan_kanan = generateElips2(
        0.5,
        36,
        18,
        1,
        0.5,
        2.5,
        1.8,
        1.0,
        0.5,
        93,
        147,
        166);
    
        var tangan_kiri = generateElips2(
        0.5,
        36,
        18,
        1,
        0.5,
        2.5,
        -1.8,
        1.0,
        0.5,
        93,
        147,
        166
        );
        
        // kuku tangan kanan 1
        var kuku_tangan_kanan_1 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        2,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        // kuku tangan kanan 2
        var kuku_tangan_kanan_2 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        1.77,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        //kuku tangan kanan 3
        var kuku_tangan_kanan_3 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        1.57,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        //kuku tangan kiri 1
        var kuku_tangan_kiri_1 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        -2,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        //kuku tangan kiri 2
        var kuku_tangan_kiri_2 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        -1.8,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        //kuku tangan kiri 3
        var kuku_tangan_kiri_3 = generateElips2(
        0.2,
        36,
        18,
        0.2,
        0.3,
        1,
        -1.6,
        1,
        -0.7,
        233,
        231,
        232
        );
    
        // ---------- KAKI KIRI ---------- //
        var kaki_kiri = generateElips2(
        0.4,
        36,
        18,
        2,
        1.2,
        2.5,
        1.6,
        1.8,
        3,
        208,
        196,
        184
        );
    
        // ---------- KAKI KANAN ---------- //
        var kaki_kanan = generateElips2(
        0.4,
        36,
        18,
        2,
        1,
        2.5,
        -1.45,
        1.8,
        3,
        208,
        196,
        184
        );
    
        // kuku kaki kiri 1
        var kuku_kaki_kiri_1 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        1.4,
        1.8,
        2,
        221,
        221,
        227
        );
    
        // kuku kaki kiri 2
        var kuku_kaki_kiri_2 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        1.7,
        1.8,
        2,
        221,
        221,
        227
        );
    
        // kuku kaki kiri 3
        var kuku_kaki_kiri_3 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        2,
        1.8,
        2,
        221,
        221,
        227
        );
    
        // kuku kaki kanan 1
        var kuku_kaki_kanan_1 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        -1.8,
        1.8,
        2,
        221,
        221,
        227
        );
    
        // kuku kaki kanan 2
        var kuku_kaki_kanan_2 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        -1.5,
        1.8,
        2,
        221,
        221,
        227
        );
    
        // kuku kaki kanan 3
        var kuku_kaki_kanan_3 = generateElips2(
        0.3,
        36,
        18,
        0.3,
        0.5,
        1,
        -1.2,
        1.8,
        2,
        221,
        221,
        227
        );
    
        //kaki kiri dalam
        var kaki_kiri_dalam = generateTabung(
          1.6,
          -3, 
          2.25, 
          0.03, 
          0.5,
          128,
          112, 
          100,
          15
        );
    
        //kaki kanan dalam
        var kaki_kanan_dalam = generateTabung(
        -1.4, //x
        -3,   // y
        2.17, // z
        0.03, //depth
        0.5, //rad
        128, //r
        112, // g
        100, //b
        15 // count
        );
    
        //topi snorlax
        var topi = generateCone(
          0, //x bawah
          0,    //y bawah
          -2  ,    //z bawah
          0, // x atas
          0,    // y atas
          1,    // z atas (atur tinggi)
          1, //radX
          1, //radY
          0, //173,
          0, //216,
          255 //230
        );
    
        var tempat_duduk = generateTabung(
        0, //x
        0.5,   // y
        4.3, // z
        0.3, //depth
        4.35, //rad
        51, //r
        255, // g
        255, //b
        15 // count
        );
    
        var penghubung_kaki_kiri = generateTabung(
        1,
        -3, 
        -0.6, 
        2, 
        0.6,
        41,
        116,
        145,
        15
        );
    
        var penghubung_kaki_kanan = generateTabung(
        -0.8,
        -3, 
        -0.55, 
        2, 
        0.6,
        41,
        116,
        145,
        15
        );
    }

    // ======= POKEBALL ======= //
    {
        var bawah_pokeball = generateHalfElips2(
        4.35,  //r
        36,
        18,
        1, //a
        1, //b
        1, //c
        0, //x
        0.2, //y
        0.4, //z
        221,
        221,
        227
        )
    
        var tengah_pokeball = generateTabung(
        0, //x
        0.2,   //y
        -0.2, //z
        1.3, //depth
        4.35, //rad
        0,  //r
        0, //g
        0, //b
        15 //count
        );
    
        var atas_pokeball = generateHalfElips2(
        4.35,  //r
        36,
        18,
        1, //a
        1, //b
        1, //c
        0, //x
        -0.2, //y
        0.2, //z
        238,
        21,
        21
        );
        var titik_pokeball = generateTabung(
          -0.4, //x
          -0.4,   //y
          3.4, //z
          1.2, //depth
          0.6, //rad
          255,  //r
          255, //g
          255, //b
          15 //count
        );

        var jiggly_bawah_pokeball = generateHalfElips2(
          4.35,  //r
          36,
          18,
          1, //a
          1, //b
          1, //c
          0, //x
          0.2, //y
          0.4, //z
          221,
          221,
          227
          )
      
          var jiggly_tengah_pokeball = generateTabung(
          0, //x
          0.2,   //y
          -0.2, //z
          1.3, //depth
          4.35, //rad
          0,  //r
          0, //g
          0, //b
          15 //count
          );
      
          var jiggly_atas_pokeball = generateHalfElips2(
          4.35,  //r
          36,
          18,
          1, //a
          1, //b
          1, //c
          0, //x
          -0.2, //y
          0.2, //z
          238,
          21,
          21
          );
          var jiggly_titik_pokeball = generateTabung(
            -0.4, //x
            -0.4,   //y
            3.4, //z
            1.2, //depth
            0.6, //rad
            255,  //r
            255, //g
            255, //b
            15 //count
          );
      
    }

    // ====== JIGGLYPUFFTITIK ====== //
    {
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
          1.0, 1.0, 2.7, 
          0.5,-1.6,0.6,
          227, 171, 181
      );

      var left_leg = generateElips2(
          0.3, 36, 18, 
          1.0, 1.0, 2.7, 
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

      var jiggly_tempat_duduk = generateTabung(
        0, //x
        0.5,   // y
        4.3, // z
        0.3, //depth
        4.35, //rad
        51, //r
        255, // g
        255, //b
        15 // count
      );

      var curve = [-0.1,0.0, 0.1,-0.2, 0.3,0];
      for (let index = 0; index < 4; index++) {
          var line_vertex = bezier.generateBSpline(curve,100,2, -0.1,-0.4,1.4);
          var line_faces = [];
          for (let index = 0; index < line_vertex.length/6; index++) {
              line_faces.push(index);
          }
          var mouth = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
          list.push(mouth);
      }
  
      
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
      jigglypuff.addChilds([left_ear_outer,jiggly_tempat_duduk]);
      left_hand.addChilds([batang_pencil, pucuk_pencil]);
      left_eye_outer.addChilds([left_eye]);
      right_eye_outer.addChilds([right_eye]);
      left_ear_outer.addChilds([left_ear]);
      right_ear_outer.addChilds([right_ear]);

      var jiggly_ball = new MyObject([],[],shader_vertex_source, shader_fragment_source);
      jiggly_bawah_pokeball.addChilds([jiggly_tengah_pokeball,jiggly_titik_pokeball]);
      jiggly_ball.addChilds([jiggly_bawah_pokeball,jiggly_atas_pokeball]);
      jigglypuff.addChilds([jiggly_ball]);
    }

    // ====== POLIWAG ====== //
    {
      var left_eye = new MyObject([],[],shader_vertex_source, shader_fragment_source);
      //buat object2 untuk jigglypuff
      var poliwag_badanluar = generateElips2(
          3.5, 36, 18, 
          1.2, 1.2, 1.2, 
          0,0,0, 
          91, 132, 181
      );
      var poliwag_badandalam = generateElips2(
          1, 36, 18, 
          2, 2, 1, 
          0,-0.7,3.5, 
          227, 234, 243
      );

      var curve = [-0.1, -2, -1, -2, -2, 0.1, 1.6, 0.3, 1, -1.7, -0.6, -1.8, -1.2, -0.4, -0.6, 0, 1.3, -0.1, 1, -1.3, 0, -1.6, -0.8, -1, -0.5, -0.1, 0.9, -0.2, 0.9, -1.2, -0.5, -1, -0.1, -0.5];
      yStart = 0;
      for (let index = 0; index < 4; index++) {
          var line_vertex = bezier.generateBSpline(curve,100,2, 0,yStart,4.5);
          var line_faces = [];
          for (let index = 0; index < line_vertex.length/2; index++) {
              line_faces.push(index);
          }
          var poliwag_spiral = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
          yStart += 0.005;
          list.push(poliwag_spiral);
      }

      var poliwag_left_eye_outer = generateElipPara2(
          0.4, 36, 18, 
          1.5, 1.5, 1.5, 
          0.97,1.8,3.3,
          255, 255,255
      );
      var poliwag_right_eye_outer = generateElipPara2(
          0.4, 36, 18, 
          1.5, 1.5, 1.5, 
          -0.97,1.8,3.3,
          255, 255,255
      );
      var poliwag_left_eye = generateElips2(
          0.2, 36, 18, 
          1.5, 1.5, 1.5, 
          1,1.85,3.7, 
          0, 0, 0
      );
      var poliwag_right_eye = generateElips2(
          0.2, 36, 18, 
          1.5, 1.5, 1.5, 
          -1,1.85,3.7, 
          0, 0, 0
      );

      var poliwag_mulut = generateElips2(
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
          var poliwag_smile = new MyObject(line_vertex, line_faces, shader_vertex_source, shader_fragment_source);
          yStart += 0.005;
          list.push(poliwag_smile);
      }

      var poliwag_kaki_kanan = generateTabung(
          2.75, -2.95, 1.35,
          2.5, 0.45,
          51, 132, 190,
          15
      );

      var poliwag_kaki_kiri = generateTabung(
          -2.75, -2.95, 1.35,
          2.5, 0.45,
          51, 132, 190,
          15
      );

      var poliwag_ekor_luar = generateElips2(
        1, 36, 18, 
        2, 3.5, 0, 
        0,-5,-2, 
        208, 219, 238
      );

      var poliwag = new MyObject([],[],shader_vertex_source, shader_fragment_source);
      poliwag.addChilds([poliwag_badanluar, poliwag_badandalam]);
      poliwag.addChilds([poliwag_left_eye]);
      poliwag.addChilds([poliwag_right_eye]);
      poliwag.addChilds([poliwag_right_eye_outer]);
      poliwag.addChilds([poliwag_left_eye_outer]);
      poliwag.addChilds([poliwag_mulut, poliwag_smile]);
      poliwag.addChilds([poliwag_kaki_kanan, poliwag_kaki_kiri]);
      poliwag.addChilds([poliwag_ekor_luar]);
      poliwag.addChilds([poliwag_spiral]);

    }

    
    //setelah definisi semua object, panggil object utama disini
    var main = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    var snorlax = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    var environment = new MyObject([],[],shader_vertex_source, shader_fragment_source);
  
    main.addChilds([snorlax]);
    main.addChilds([jigglypuff]);
    main.addChilds([poliwag]);
    main.addChilds([environment]);
    snorlax.addChilds([muka,muka_dalam,telinga_kiri,telinga_kanan]);
    snorlax.addChilds([badan,badan_dalam,tangan_kanan,tangan_kiri]);
    snorlax.addChilds([kaki_kanan,kaki_kiri]);
    snorlax.addChilds([tempat_duduk,topi]);

    tangan_kanan.addChilds([kuku_tangan_kanan_1,kuku_tangan_kanan_2,kuku_tangan_kanan_3]);
    tangan_kiri.addChilds([kuku_tangan_kiri_1,kuku_tangan_kiri_2,kuku_tangan_kiri_3]);
    kaki_kanan.addChilds([kaki_kanan_dalam,kuku_kaki_kanan_1,kuku_kaki_kanan_2,kuku_kaki_kanan_3,penghubung_kaki_kanan])
    kaki_kiri.addChilds([kaki_kiri_dalam,kuku_kaki_kiri_1,kuku_kaki_kiri_2,kuku_kaki_kiri_3,penghubung_kaki_kiri]);
    muka_dalam.addChilds([alisKiri,alisKanan,mulut]);
    
    var snorlax_ball = new MyObject([],[],shader_vertex_source, shader_fragment_source);
    bawah_pokeball.addChilds([tengah_pokeball,titik_pokeball]);
    snorlax_ball.addChilds([bawah_pokeball,atas_pokeball]);
    snorlax.addChilds([snorlax_ball]);


    // env
    {
      var buletan_awan_1 = generateElips2(
        3,
        36,
        18,
        1,
        0.5,
        1,
        -1.2,
        1.8,
        2,
        102,
        255,
        255
      )

      var buletan_awan_2 = generateElips2(
      2.2,
      36,
      18,
      1,
      0.5,
      1,
      1.5,
      1.7,
      2,
      102,
      255,
      255
      )

      var buletan_awan_3 = generateElips2(
      2.2,
      36,
      18,
      1,
      0.5,
      1,
      -4.5,
      1.7,
      2,
      102,
      255,
      255
      );

      var tanah = generateHalfElips2(
        4.35, 36, 18,
        10, 1, 10,
        10, 0, 10.4,
        51, 255, 51
      );

      var awan1 = new MyObject([],[],shader_vertex_source, shader_fragment_source);
      awan1.addChilds([buletan_awan_1,buletan_awan_2,buletan_awan_3]);

      environment.addChilds([awan1, tanah]);

    }


    //MATRIX
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEWMATRIX = LIBS.get_I4(); 

    LIBS.translateZ(VIEWMATRIX, -25);


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
  
  var time_start = Date.now();
  var maxTranslation1 = 0.002;
  var maxTranslationTangan = 0.002; // Maksimum jarak translasi dari pusat (dalam unit)
  var period = 2000; // Periode gerakan (dalam milidetik)

  //timy
  var maxTranslationKaki = 0.09;
  var maxTranslationEkor = 0.09;
  var period2 = 200;

  //ivan
  var maxTranslationKu = 0.5;
  var maxTranslationKaki = 0.3;
  var period3 = 3000;

  jigglypuff.setArrTranslate(10,0,0)
  jigglypuff.setArrScale(1.5)
  jiggly_ball.setArrScale(1);
  jiggly_tempat_duduk.setArrScale(1);
  poliwag.setArrTranslate(-10,0,0)
  jigglypuff.setArrOrigin(10,0,0)
  var animate = function (time) {
    jigglypuff.setRotate(0,0.1,0)
    var elapsedTime = Date.now() - time_start;
    if (time > 0) {
        var dt = time - time_prev;
        if (!drag) {
            dX *= AMORTIZATION;
            dY *= AMORTIZATION;
            THETA += dX;
            PHI += dY;
        }          
        main.setRotateMove(PHI, THETA, 0);

        time_prev = time;
    }
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        
    if (time > 1500){
      //Gerak tangan Kanan
      var translationKanan =
        Math.sin(((elapsedTime % period) / period) * Math.PI * 2) *
        maxTranslationTangan;
        tangan_kanan.setTranslateMove(translationKanan,0, 0); // Atur pergerakan tangan kanan ke kanan dan kiri

      // Gerak tangan Kiri
      var translationKiri =
        Math.sin((((elapsedTime+period /2) % period) / period) * Math.PI * 2) *
        maxTranslationTangan;
        tangan_kiri.setTranslateMove(translationKanan,-translationKiri, 0); // Atur pergerakan tangan kanan ke kanan dan kiri

      // Gerak Telinga
      var translationTelinga =
      Math.sin(((elapsedTime+period / 2 % period) / period) * Math.PI * 2) *
      maxTranslation1;
      telinga_kiri.setTranslateMove(translationTelinga,translationTelinga,-translationTelinga);
      muka.setTranslateMove(translationTelinga,0,0);
      muka_dalam.setTranslateMove(translationTelinga,0,0);
    }

    if(elapsedTime < 2000){
      atas_pokeball.setTranslateMove(0,0.04,0);
      bawah_pokeball.setTranslateMove(0,-0.0452,0);
      snorlax.setScale(0.998);
    
      jiggly_atas_pokeball.setTranslateMove(0,0.04,0);
      jiggly_bawah_pokeball.setTranslateMove(0,-0.0452,0);
      jigglypuff.setScale(1.0002);
    }

    else if (time > 2000) { 
      snorlax.setRotate(0,0.1,0);
    }

    //ball
    {
      glMatrix.mat4.rotateX(
        jiggly_bawah_pokeball.MOVEMATRIX,
        jiggly_bawah_pokeball.MOVEMATRIX,
        LIBS.degToRad(90)
      );

      glMatrix.mat4.rotateX(
        jiggly_atas_pokeball.MOVEMATRIX,
        jiggly_atas_pokeball.MOVEMATRIX,
        LIBS.degToRad(-90)
      );

      glMatrix.mat4.rotateX(
        jiggly_tengah_pokeball.MOVEMATRIX,
        jiggly_tengah_pokeball.MOVEMATRIX,
        LIBS.degToRad(90)
      );

    }

    {
      glMatrix.mat4.rotateX(
        tanah.MOVEMATRIX,
        tanah.MOVEMATRIX,
        LIBS.degToRad(90)
      );
    }

    // SNORLAX MOVE
    {
      glMatrix.mat4.rotateX(
        topi.MOVEMATRIX,
        topi.MOVEMATRIX,
        LIBS.degToRad(90)
      );

      glMatrix.mat4.rotateX(
        tempat_duduk.MOVEMATRIX,
        tempat_duduk.MOVEMATRIX,
        LIBS.degToRad(90)
      );
      glMatrix.mat4.rotateX(
        bawah_pokeball.MOVEMATRIX,
        bawah_pokeball.MOVEMATRIX,
        LIBS.degToRad(90)
      );

      glMatrix.mat4.rotateX(
        atas_pokeball.MOVEMATRIX,
        atas_pokeball.MOVEMATRIX,
        LIBS.degToRad(-90)
      );

      glMatrix.mat4.rotateX(
        tengah_pokeball.MOVEMATRIX,
        tengah_pokeball.MOVEMATRIX,
        LIBS.degToRad(90)
      );

      glMatrix.mat4.rotateX(
          badan.MOVEMATRIX,
          badan.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          tangan_kanan.MOVEMATRIX,
          tangan_kanan.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          tangan_kiri.MOVEMATRIX,
          tangan_kiri.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kaki_kanan.MOVEMATRIX,
          kaki_kanan.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kaki_kiri.MOVEMATRIX,
          kaki_kiri.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kanan_1.MOVEMATRIX,
          kuku_tangan_kanan_1.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kanan_2.MOVEMATRIX,
          kuku_tangan_kanan_2.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kanan_3.MOVEMATRIX,
          kuku_tangan_kanan_3.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kiri_1.MOVEMATRIX,
          kuku_tangan_kiri_1.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kiri_2.MOVEMATRIX,
          kuku_tangan_kiri_2.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_tangan_kiri_3.MOVEMATRIX,
          kuku_tangan_kiri_3.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kanan_1.MOVEMATRIX,
          kuku_kaki_kanan_1.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kanan_2.MOVEMATRIX,
          kuku_kaki_kanan_2.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kanan_3.MOVEMATRIX,
          kuku_kaki_kanan_3.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kiri_1.MOVEMATRIX,
          kuku_kaki_kiri_1.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kiri_2.MOVEMATRIX,
          kuku_kaki_kiri_2.MOVEMATRIX,
          LIBS.degToRad(90)
        );
    
        glMatrix.mat4.rotateX(
          kuku_kaki_kiri_3.MOVEMATRIX,
          kuku_kaki_kiri_3.MOVEMATRIX,
          LIBS.degToRad(90)
        );

    }

    // jigglyMove
    {
      function walking(){
            left_leg.setRotate(
                Math.sin((( elapsedTime % period3) / period3) * Math.PI * 2) *
            maxTranslationKaki,
            Math.cos((( elapsedTime % period3) / period3) * Math.PI) *
            -0.08,
                0
            )

            right_leg.setRotate(
                -Math.sin((( elapsedTime % period3) / period3) * Math.PI * 2) *
            maxTranslationKaki,
            Math.cos((( elapsedTime % period3) / period3) * Math.PI) *
            0.08,
            0
            )
      }

      function lambai(){
          left_hand.setRotate(
              Math.sin((( elapsedTime % period3) / period3) * Math.PI * 2) *
              maxTranslationKu,
              0,
              0
          )
      }

      function moveEar(){
        var jiggly_earTrans =
        Math.sin(((elapsedTime % 2000) / 2000) * Math.PI * 2) *
        0.004;
        left_ear_outer.setTranslateMove(jiggly_earTrans,jiggly_earTrans,-jiggly_earTrans);
        right_ear_outer.setTranslateMove(-jiggly_earTrans,-jiggly_earTrans,jiggly_earTrans);
      }
      
      walking();
      lambai();
      moveEar();

      glMatrix.mat4.rotateX(
        jiggly_tempat_duduk.MOVEMATRIX,
        jiggly_tempat_duduk.MOVEMATRIX,
        LIBS.degToRad(90)
      );


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
      
    }

    // poliwag
    {
      glMatrix.mat4.rotateX(
        poliwag_ekor_luar.MOVEMATRIX,
        poliwag_ekor_luar.MOVEMATRIX,
        LIBS.degToRad(-35)
      );

      if(time>0&&time<1000)
      {
          poliwag.setScale(1.01);
      }
      
      poliwag.setRotate(0, 0.5, 0)

      
      var translationEkor =
      Math.sin(((elapsedTime % period2) / period2) * Math.PI * 2) *
      maxTranslationEkor;
      poliwag_ekor_luar.setTranslateMove(translationEkor,0, 0); 

      var translationKakiKanan =
      Math.sin(((elapsedTime % period2) / period2) * Math.PI * 2) *
      maxTranslationKaki;
      poliwag_kaki_kanan.setTranslateMove(0,0, translationKakiKanan); 

      var translationKakiKiri =
      Math.sin(((elapsedTime % period2) / period2) * Math.PI * 2) *
      maxTranslationKaki;
      poliwag_kaki_kiri.setTranslateMove(0,translationKakiKiri, 0);

      poliwag.setRotateMove(1, 0, 0)


    }
   
  
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    main.setuniformmatrix4(PROJMATRIX, VIEWMATRIX);
    main.draw();
    main.setIdentityMove();

    GL.flush();
    window.requestAnimationFrame(animate);
  }
  animate()
}

window.addEventListener('load', main);