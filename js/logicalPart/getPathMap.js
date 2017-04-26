function getPathMap(L, B) {
	var L2B = [];
	var B2L = [];
	var width = Math.floor(B / L);
	for (var i = 0; i < B; i++) B2L[i] = [];
	for (var i = 0; i < L; i++) L2B[i] = width;

	var remain = B - L * width;
	var center = Math.floor(L / 2);
	if (remain > 0) {
		L2B[center] += 1;
		remain--;
	}
	var i = 1;
	while (remain > 0) {
		if (remain-- > 0) {
			L2B[center+i] += 1;
		} else {
			break;
		}
		if (remain-- > 0) {
			L2B[center-i] += 1;
		} else {
			break;
		}
	}

	var c = 0;
	for (i = 0; i < L; i++) {
		var tmp = [];
		for (var j = 0; j < L2B[i]; j++) {
			tmp.push(c + j);
			B2L[c+j].push(i);
		}
		c += L2B[i];
		L2B[i] = tmp;
	}
	return {L2B:L2B, B2L:B2L};
}