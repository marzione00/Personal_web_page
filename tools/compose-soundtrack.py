"""Local Coordinates — original deterministic synthetic ambient score, 270 seconds.
No recorded samples, quoted themes, external instruments or network requests.
Reproduce with Python + numpy + scipy + soundfile; encode with FFmpeg afterwards.
Normal site builds use the checked-in MP3 and do not run this generator.
"""
from pathlib import Path
import argparse,json
import numpy as np
from scipy import signal
import soundfile as sf

p=argparse.ArgumentParser();p.add_argument('--output',default=str(Path(__file__).resolve().parents[1]/'audio-master'));args=p.parse_args()
OUT=Path(args.output);OUT.mkdir(exist_ok=True,parents=True)
FS=44100;DURATION=270;N=FS*DURATION
rng=np.random.default_rng(73142026)
mix=np.zeros((N,2),dtype=np.float32)
score=[]

def freq(m):return 440*2**((m-69)/12)
def envelope(t,length,attack,release):
    a=np.clip(t/attack,0,1);r=np.clip((length-t)/release,0,1)
    return (np.sin(a*np.pi/2)**2*np.sin(r*np.pi/2)**2).astype(np.float32)
def add_note(start,length,midi,amp,kind='strings',pan=0,attack=5,release=8):
    i=int(start*FS);n=min(int(length*FS),N-i)
    if n<=0:return
    t=np.arange(n,dtype=np.float32)/FS;f=freq(midi)
    env=envelope(t,length,attack,release)
    y=np.zeros(n,dtype=np.float32)
    phase0=rng.uniform(0,2*np.pi)
    if kind=='strings':
        # Slowly beating, band-limited harmonic ensemble, softly bowed rather than sawtooth.
        for detune in [-.0052,0,.0041]:
            vib=.026*np.sin(2*np.pi*.12*t+phase0)+.014*np.sin(2*np.pi*.193*t)
            phase=2*np.pi*f*(1+detune)*t+vib
            for h in range(1,9):
                y+=np.sin(h*phase+phase0*.31*h).astype(np.float32)*(1/(h**1.85))*np.exp(-(f*h/2100)**1.6)/3
        y*=.8+.12*np.sin(2*np.pi*.035*t+phase0)
    elif kind=='choir':
        for h in range(1,14):
            hz=f*h
            weight=(.35*np.exp(-((hz-600)/260)**2)+.24*np.exp(-((hz-1150)/390)**2)+.32/(h**1.7))
            y+=weight*np.sin(2*np.pi*hz*t+.025*h*np.sin(2*np.pi*.07*t+phase0)+phase0)
        y*=.65
    elif kind=='glass':
        for ratio,weight,decay in [(1,1,18),(2.01,.21,11),(2.98,.09,8),(4.08,.035,5)]:
            y+=weight*np.exp(-t/decay)*np.sin(2*np.pi*f*ratio*t+phase0)
    elif kind=='bass':
        y=np.sin(2*np.pi*f*t+.02*np.sin(2*np.pi*.08*t))+.13*np.sin(2*np.pi*2*f*t+phase0)+.08*np.sin(2*np.pi*3*f*t)
    else:raise ValueError(kind)
    y*=env*amp
    # Equal-power stereo image, with a very small natural difference between channels.
    left=np.sqrt((1-pan)/2);right=np.sqrt((1+pan)/2)
    mix[i:i+n,0]+=y*left;mix[i:i+n,1]+=y*right
    score.append(dict(start=start,length=length,midi=midi,amplitude=amp,timbre=kind,pan=pan))

# A continuous tonal field; harmony evolves in twelve overlapping regions, not a repeated short loop.
chords=[
 (0,[50,57,62,64],.8), (23,[46,53,57,64],.88),
 (47,[48,55,60,62],.96),(71,[50,57,65,69],1.03),
 (94,[43,50,57,62],1.04),(116,[46,53,60,64],1.08),
 (139,[45,52,58,64],1.10),(161,[50,57,63,69],1.15),
 (182,[46,53,57,65],1.08),(203,[48,55,62,64],.96),
 (224,[50,57,62,64],.88),(244,[38,50,57,62],.70)]
for j,(start,notes,level) in enumerate(chords):
    for k,m in enumerate(notes):
        add_note(start+k*.9,40,m,.033*level*(.88 if k==3 else 1),pan=[-.52,.45,-.18,.26][k],attack=8,release=13)
# Foundation: slow dynamic arcs, never a bass beat.
for start,m in [(0,38),(46,34),(88,31),(128,33),(171,34),(214,38)]:
    add_note(start,61,m,.040,kind='bass',attack=11,release=19,pan=0)
# Airy formant layer emerges gradually, without words or voice samples.
for start,notes in [(39,[62,69]),(86,[60,67]),(127,[65,69]),(170,[62,70]),(215,[62,69])]:
    for k,m in enumerate(notes):add_note(start+k*2.2,47,m,.014,kind='choir',attack=14,release=18,pan=(-.35 if k else .36))
# Sparse original upper-voice gestures, with deliberately irregular timing.
for k,(start,m) in enumerate([(28,76),(54,74),(79,77),(103,76),(132,72),(151,74),(174,75),(197,74),(221,69),(241,74)]):
    add_note(start,26,m,.017 if k<6 else .014,kind='glass',pan=(-.38 if k%2 else .42),attack=1.4,release=10)
# Very low-level diffuse air, low-pass and high-pass filtered to avoid hiss.
for ch in [0,1]:
    noise=rng.normal(0,1,N).astype(np.float32)
    sos=signal.butter(2,[280,2400],btype='bandpass',fs=FS,output='sos')
    noise=signal.sosfilt(sos,noise).astype(np.float32)
    t=np.arange(N,dtype=np.float32)/FS
    mix[:,ch]+=noise*.0007*envelope(t,DURATION,20,24)*(.65+.35*np.sin(2*np.pi*.008*t+ch)**2)
# Diffuse stereo room: deterministic exponentially decaying impulse responses.
for ch in [0,1]:
    n=int(FS*4.6);t=np.arange(n,dtype=np.float32)/FS
    ir=rng.normal(0,1,n).astype(np.float32)*np.exp(-t/1.06)
    ir=signal.sosfilt(signal.butter(2,2900,fs=FS,output='sos'),ir).astype(np.float32)
    ir[:int(.055*FS)]=0
    ir/=max(np.sqrt(np.sum(ir*ir)),1e-9)
    wet=signal.fftconvolve(mix[:,ch],ir,mode='full')[:N].astype(np.float32)
    mix[:,ch]=mix[:,ch]*.83+wet*.29
# Remove subsonic/DC, gentle overall fades; leave plenty of headroom before loudness mastering.
mix=signal.sosfilt(signal.butter(2,27,fs=FS,btype='highpass',output='sos'),mix,axis=0).astype(np.float32)
fade_in=int(FS*7);fade_out=int(FS*8)
mix[:fade_in]*=(np.sin(np.linspace(0,np.pi/2,fade_in))**2)[:,None]
mix[-fade_out:]*=(np.cos(np.linspace(0,np.pi/2,fade_out))**2)[:,None]
peak=float(np.max(np.abs(mix)));mix*=.68/max(peak,1e-8)
sf.write(OUT/'local-coordinates-premaster.wav',mix,FS,subtype='PCM_24')
(OUT/'score.json').write_text(json.dumps({'title':'Local Coordinates','durationSeconds':270,'sampleRate':FS,'seed':73142026,'externalSamples':False,'notes':score},indent=2))
print(json.dumps({'seconds':len(mix)/FS,'events':len(score),'peak':float(np.max(np.abs(mix))),'rms':float(np.sqrt(np.mean(mix**2))),'file':str(OUT/'local-coordinates-premaster.wav')},indent=2),flush=True)
