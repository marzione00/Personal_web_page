# Covariance ellipsoid

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Covariance ellipsoid

## tema
Quantitative finance

## formula
(x−μ)ᵀΣ⁻¹(x−μ) = 1
Σ = TTᵀ,  T = [[1.6,0.5,0.1],[0,0.85,0.24],[0,0,0.65]]

## spiegazione
The ellipsoid translates a covariance matrix into spatial directions and magnitudes. The highlighted cross-sections reveal anisotropy: dispersion is not the same in every direction.

## limiti
The displayed level corresponds to a Mahalanobis distance of one. It does not automatically represent a 95% confidence region or a portfolio efficient frontier. The matrix is synthetic and positive definite.

## fonti
[SciPy — covariance and multivariate density](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Compare the directions in which the ellipsoid extends furthest with those in which it narrows, rotating it to see how the same shape has different widths and how the highlighted sections help reveal this variation in dispersion.

## lettura
The surface contains points whose quadratic form of deviation from the mean, using inverse covariance, equals one; covariance is matrix T times its transpose.
