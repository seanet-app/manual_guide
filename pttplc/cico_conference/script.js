        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImage");
        const closeBtn = document.getElementsByClassName("close")[0];
        
        document.querySelectorAll('.manual-image').forEach(img => {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
                if (window.innerWidth > 768) {
                    modalImg.style.cursor = 'zoom-in';
                    modalImg.onclick = function() {
                        if (this.style.objectFit == "contain") {
                            this.style.objectFit = "none";
                            this.style.cursor = 'zoom-out';
                        } else {
                            this.style.objectFit = "contain";
                            this.style.cursor = 'zoom-in';
                        }
                    }
                }
            }
        });

        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // ฟังก์ชันสำหรับซูมบนมือถือ
        let touchStartX = 0;
        let touchStartY = 0;
        let initialPinchDistance = 0;
        let currentScale = 1;

        modalImg.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                initialPinchDistance = getPinchDistance(e);
            } else if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });

        modalImg.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (e.touches.length === 2) {
                const currentDistance = getPinchDistance(e);
                const scaleDiff = currentDistance / initialPinchDistance;
                currentScale = Math.min(Math.max(currentScale * scaleDiff, 1), 3);
                modalImg.style.transform = `scale(${currentScale})`;
                initialPinchDistance = currentDistance;
            } else if (e.touches.length === 1) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                modalImg.style.left = `${touchX - touchStartX}px`;
                modalImg.style.top = `${touchY - touchStartY}px`;
            }
        });

        function getPinchDistance(e) {
            return Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // ค้นหาส่วน gifContainer และ modal
        var gifContainer = document.getElementById("gifContainer");
        var modal = document.getElementById("imageModal");
        var modalImg = document.getElementById("modalImage");
        var span = document.getElementsByClassName("close")[0];

        // เมื่อคลิกที่ gifContainer ให้แสดง modal
        gifContainer.onclick = function() {
            modal.style.display = "block";
            // แสดงเนื้อหาทั้งหมดของ gifContainer ใน modal โดยการคัดลอกเนื้อหา
            modalImg.src = this.querySelector("img").src; // ใช้ภาพภายในเป็น modal content
        }

        // เมื่อคลิกปุ่มปิด ให้ปิด modal
        span.onclick = function() { 
            modal.style.display = "none";
        }
