const vertexShaderSource = `#version 300 es
 
in vec4 a_position;
 
void main()
{
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;
 
uniform vec4 u_color;

out vec4 outColor;
 
void main()
{
  outColor = u_color;
}
`;

const main = () => {
  const canvas = document.querySelector("canvas#canvas1") as HTMLCanvasElement;

  if (!canvas) {
    console.log("canvas not found");
    return;
  }

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("webgl2 is not supported");
    return;
  }

  const createShader = (type, source) => {
    const shader = gl.createShader(type);

    if (!shader) {
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }

    return shader;
  };

  const createProgram = (
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) => {
    const program = gl.createProgram();

    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.log(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }

    return program;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    console.log("shaders were not created");
    return;
  }

  const program = createProgram(vertexShader, fragmentShader);

  if (!program) {
    console.log("program was not created");
    return;
  }

  // get locations
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const uColorLocation = gl.getUniformLocation(program, "u_color");

  // create and bind buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // create and bind vertex array
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0); // index, size, type, normalized, stride, offset

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  // draw first triangle
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 0.5, 0.5, 0]),
    gl.STATIC_DRAW
  );
  gl.uniform4f(uColorLocation, 0, 1, 0, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // draw second triangle
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-0.5, 0, 0, 0, -0.25, 0.5]),
    gl.STATIC_DRAW
  );
  gl.uniform4f(uColorLocation, 1, 0, 0, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
