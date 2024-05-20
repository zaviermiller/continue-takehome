import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useState, useRef, useCallback, useEffect } from 'react';
import PlaygroundEditor from './components/PlaygroundEditor';
import { useDebounce } from './util/useDebounce'; // Adjust the import path as needed
function App() {
  const [code, setCode] =
    useState<string>(`// DO NOT MODIFY THIS FUNCTION PROTOTYPE
function Receipt() {
    return rc('receipt', null, [
      // CHANGE ME
      text('hello world!')
    ])
}`);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCodeExecution = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(code, '*');
    }
  }, [code]);

  const debouncedHandleCodeExecution = useDebounce(handleCodeExecution, 300);
  useEffect(() => {
    debouncedHandleCodeExecution();
  }, [code, debouncedHandleCodeExecution]);

  return (
    <>
      <AppBar color="transparent" variant="outlined" position="relative">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Receipt Components Playground
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="section" sx={{ position: 'relative', height: '100%' }}>
        <Box component="main" sx={{ flexGrow: 1, height: '100%' }}>
          <Grid2
            container
            spacing={2}
            sx={{
              height: '100%',
            }}
          >
            <Grid2 xs={12} md={6}>
              <PlaygroundEditor code={code} onChange={setCode} />
            </Grid2>
            <Grid2 xs={12} md={6}>
              <Typography variant="h6">PREVIEW</Typography>
              <iframe
                ref={iframeRef}
                title="code-execution"
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts"
                src="/sandbox.html"
              ></iframe>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </>
  );
}

export default App;
