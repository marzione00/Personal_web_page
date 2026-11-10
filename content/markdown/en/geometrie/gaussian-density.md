# Gaussian density

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Gaussian density

## tema
Quantitative methods

## formula
f(x) = exp[−½(x−μ)ᵀΣ⁻¹(x−μ)] / (2π√detΣ)
μ = (0,0),  Σ = [[1,0.55],[0.55,1]]

## spiegazione
The surface describes a bivariate normal density. Correlation tilts the bell’s cross-sections: observing its shape helps distinguish dispersion from dependence between the two components.

## limiti
The height is rescaled as 9f − 0.7 for display. This is a theoretical distribution with stated parameters, not an estimate obtained from observations.

## fonti
[SciPy — multivariate_normal](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Compare the elliptical sections, which follow constant density levels, and switch between top and side views to recognise both the orientation of dispersion and the changing height.

## lettura
The Gaussian density exponent is minus one half of the quadratic form of the deviation from the mean with the inverse covariance; normalisation is two pi times the square root of the determinant of sigma.

## legenda
blue | density grid
pale | three constant-density ellipses
amber | fourth ellipse, selected as a reference
