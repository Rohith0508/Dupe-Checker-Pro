// ==UserScript==
// @name         Dupe Checker Darkbytes Pro
// @namespace    127.0.0.1
// @version      3.3
// @description  Final polished version: Minimize + Restore button, bottom-right default, case ID links, smooth drag, pro UI – no refresh needed anymore for restore panel!
// @author       SK, Rohith
// @match        https://portal.mdr.sophos.com/soc/cases/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes cyberSpin {
            0% { transform: rotate(0deg); border-top-color: #00ffc3; }
            25% { border-top-color: #00e0ff; }
            50% { border-top-color: #8e44ad; }
            75% { border-top-color: #ff0080; }
            100% { transform: rotate(360deg); border-top-color: #00ffc3; }
        }
        .loader {
            border: 4px solid #21262d;
            border-top: 4px solid #00ffc3;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: cyberSpin 1.2s linear infinite;
            margin: 20px auto;
        }
    `;
    document.head.appendChild(style);

    function getTokens() {
        const xAccessToken = sessionStorage.getItem('accessToken');
        const xIdToken = sessionStorage.getItem('idToken');
        return xAccessToken && xIdToken ? { xAccessToken, xIdToken } : null;
    }

    function sendRequestWithCustomerId(tokens, customerId, keyword, monthsBack = 6) {
        const to_epoch = Math.floor(Date.now() / 1000);
        const from_epoch = to_epoch - (60 * 60 * 24 * 30 * monthsBack);
        const url = `https://prod-us-east-2.accessor.darkbytes.io/ui/soc/cases?customer_id=${customerId}&startTime=${from_epoch}&endTime=${to_epoch}`;
        const headers = new Headers({
            'x-access-token': tokens.xAccessToken,
            'x-id-token': tokens.xIdToken,
        });

        const resultContainer = document.querySelector('#dupeCheckerContainer .result');
        resultContainer.innerHTML = '';
        const loader = document.createElement('div');
        loader.className = 'loader';
        resultContainer.appendChild(loader);
        resultContainer.style.display = 'block';

        fetch(url, { method: 'GET', headers })
            .then(res => {
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            })
            .then(data => printAllNotesAndRegionId(data, keyword))
            .catch(err => {
                resultContainer.innerHTML = `<div style="color: red;">${err.message}</div>`;
            });
    }

    function getCustomerIdFromUrl() {
        return new URLSearchParams(window.location.search).get('customer_id');
    }

    function createSearchInput() {
        const container = document.createElement('div');
        container.id = 'dupeCheckerContainer';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: '9999',
            width: '380px',
            background: '#0e1117',
            color: '#c9d1d9',
            fontFamily: 'Consolas, monospace',
            border: '1px solid #30363d',
            borderRadius: '10px',
            boxShadow: '0 0 18px rgba(0,255,150,0.1)',
            resize: 'both',
            overflow: 'auto',
            padding: '20px',
            transition: 'all 0.3s ease'
        });

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';
        header.style.cursor = 'move';

        const title = document.createElement('div');
        title.textContent = '🔍 Dupe Checker Pro';
        Object.assign(title.style, {
            flex: '1',
            fontWeight: 'bold',
            fontSize: '18px',
            userSelect: 'none',
            color: '#58a6ff'
        });

        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '8px';

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '➖';
        minimizeBtn.className = 'min-btn';
        Object.assign(minimizeBtn.style, {
            border: 'none',
            background: 'transparent',
            color: '#f0f6fc',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = '⬆️';
        restoreBtn.style.display = 'none';
        Object.assign(restoreBtn.style, {
            border: 'none',
            background: 'transparent',
            color: '#00ffcc',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.className = 'close-btn';
        Object.assign(closeBtn.style, {
            border: 'none',
            background: 'transparent',
            color: '#f85149',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        closeBtn.onclick = () => (container.style.display = 'none');

        let minimized = false;
        minimizeBtn.onclick = () => {
            minimized = true;
            container.querySelectorAll('input, select, .result, button:not(.close-btn):not(.min-btn)').forEach(el => el.style.display = 'none');
            restoreBtn.style.display = 'inline-block';
            minimizeBtn.style.display = 'none';
        };

        restoreBtn.onclick = () => {
            minimized = false;
            container.querySelectorAll('input, select, .result, button').forEach(el => {
                if (!el.classList.contains('close-btn') && !el.classList.contains('min-btn')) {
                    el.style.display = '';
                }
            });
            restoreBtn.style.display = 'none';
            minimizeBtn.style.display = 'inline-block';
        };

        buttonGroup.appendChild(minimizeBtn);
        buttonGroup.appendChild(restoreBtn);
        buttonGroup.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(buttonGroup);
        container.appendChild(header);

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = 'Enter keyword to search in notes';
        Object.assign(keywordInput.style, {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #30363d',
            backgroundColor: '#21262d',
            color: '#c9d1d9',
            marginBottom: '12px',
        });

        const selectRange = document.createElement('select');
        Object.assign(selectRange.style, {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#21262d',
            border: '1px solid #30363d',
            color: '#c9d1d9',
            marginBottom: '12px',
        });

        ['1', '3', '6'].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = `${val} Month${val === '1' ? '' : 's'}`;
            selectRange.appendChild(opt);
        });
        selectRange.value = '6';

        const searchButton = document.createElement('button');
        searchButton.textContent = '🛡️ Search';
        Object.assign(searchButton.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
        });

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '📁 Show Results';
        Object.assign(toggleButton.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#8e44ad',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
        });

        const resultContainer = document.createElement('div');
        resultContainer.className = 'result';
        Object.assign(resultContainer.style, {
            display: 'none',
            marginTop: '10px',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#161b22',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '13px',
            border: '1px solid #30363d'
        });

        container.appendChild(keywordInput);
        container.appendChild(selectRange);
        container.appendChild(searchButton);
        container.appendChild(toggleButton);
        container.appendChild(resultContainer);
        document.body.appendChild(container);

        searchButton.onclick = () => {
            const keyword = keywordInput.value.trim();
            const monthsBack = parseInt(selectRange.value);
            const tokens = getTokens();
            const customerId = getCustomerIdFromUrl();
            if (keyword && tokens && customerId) {
                searchButton.style.backgroundColor = '#005a9e';
                searchButton.style.boxShadow = 'inset 0 0 10px #00e0ff';
                setTimeout(() => {
                    searchButton.style.backgroundColor = '#007acc';
                    searchButton.style.boxShadow = '';
                }, 150);
                sendRequestWithCustomerId(tokens, customerId, keyword, monthsBack);
            }
        };

        toggleButton.onclick = () => {
            const visible = resultContainer.style.display === 'block';
            resultContainer.style.display = visible ? 'none' : 'block';
            toggleButton.textContent = visible ? '📁 Show Results' : '📂 Hide Results';
        };

        let isDragging = false, offsetX = 0, offsetY = 0;
        header.onmousedown = e => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        };
        document.onmouseup = () => {
            isDragging = false;
            document.body.style.userSelect = '';
        };
        document.onmousemove = e => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
                container.style.bottom = 'auto';
                container.style.right = 'auto';
            }
        };
    }

    function printAllNotesAndRegionId(data, keyword = '') {
        const resultContainer = document.querySelector('#dupeCheckerContainer .result');
        resultContainer.innerHTML = '';
        const sanitized = keyword.replace(/[^0-9a-z]/gi, '').toLowerCase();
        let count = 0;

        if (Array.isArray(data.data)) {
            data.data.forEach(item => {
                if (item.notes && item.region_coded_id) {
                    const note = item.notes.replace(/[^0-9a-z]/gi, '').toLowerCase();
                    if (note.includes(sanitized)) {
                        const div = document.createElement('div');
                        div.style.marginBottom = '12px';
                        div.style.paddingBottom = '10px';
                        div.style.borderBottom = '1px solid #30363d';
                        div.innerHTML = `
                            <div><strong>🆔 Case ID:</strong>
                                <a href="https://portal.mdr.sophos.com/soc/cases/${item.region_coded_id}"
                                   target="_blank"
                                   style="color:#58a6ff; text-decoration: underline;">
                                   ${item.region_coded_id}
                                </a>
                            </div>
                            <div><strong>📝 Note:</strong> ${item.notes}</div>`;
                        resultContainer.appendChild(div);
                        count++;
                    }
                }
            });
            const summary = document.createElement('div');
            summary.style.color = '#2ea043';
            summary.style.fontWeight = 'bold';
            summary.style.marginTop = '10px';
            summary.textContent = count
                ? `✅ ${count} match(es) for "${keyword}"`
                : `❌ No matches for "${keyword}"`;
            resultContainer.appendChild(summary);
        }
    }

    createSearchInput();
})();
