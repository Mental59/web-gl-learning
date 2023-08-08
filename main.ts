const vertexShaderSource = `#version 300 es
 
in vec4 a_position;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec3 aColor;

out vec3 vColor;
 
void main()
{
  vColor = aColor;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;
 
void main()
{
  outColor = vec4(vColor, 1.0);
}
`;

const main = () => {
  const canvas = document.querySelector('canvas#canvas1') as HTMLCanvasElement;

  if (!canvas) {
    console.log('canvas not found');
    return;
  }

  const gl = canvas.getContext('webgl2');

  if (!gl) {
    console.log('webgl2 is not supported');
    return;
  }

  const createShader = (type: number, source: string) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }

    return shader;
  };

  const createAndLinkProgram = (
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ) => {
    const program = gl.createProgram();

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

  const program = createAndLinkProgram(vertexShader, fragmentShader);

  const aPositionLoc = 0;
  const aColorLoc = 1;

  // prettier-ignore
  const bufferData = new Float32Array([
    0,1,      1,0,0,
   -1,-1,     0,1,0,
    1,-1,     0,0,1,
  ]);

  gl.enableVertexAttribArray(aPositionLoc);
  gl.enableVertexAttribArray(aColorLoc);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 5 * 4, 0);
  gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

  gl.useProgram(program);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
