export const createOrderFulfillmentEmail = (name) => {
  const email = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        
            <style type="text/css">
                body, p, div {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 22px;
                    padding: 1rem;
                }
                body {
                        color: #000000;
                    }
                    body a {
                        color: #1188E6;
                        text-decoration: none;
                    }
                    p { margin: 0; padding: 0; }
                    @media screen and (max-width:480px) {
                    
                    }
                </style>
        </head>
        <body>
            <div>Dear ${name},</div>
            <br></br>
            <div>Your order has been shipped and it's on its way!</div>
        </body> 
    </html>`;
  return email;
};
