<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "600">
	<tr>
	    <td class = "body" valign = "top"  align = "center"  height = "83">
			<br><h1>Alpaca Products for Sale</h1>
				
				</div><br>
       
	
  </td>
		</tr>
	</table>
<% 
 Dim Imagearray(1000)
While Not rs.eof  
	

			counter = counter +1	
					


		 %>          
         <table border = "0" width = "600"    leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
			<tr>
		      <% For counter = 1 To 3 %>
						<td class = "products" width = "200" align = "center" >
							<%
							If Not rs.eof Then 

						prodSubCategoryId = rs("prodSubCategoryId")

								sql2 = "SELECT distinct sfProducts.*, sfCategories.*, ProductsPhotos.ProductImage1 FROM sfProducts, sfCategories, ProductsPhotos, sfcustomers WHERE sfProducts.custid = sfcustomers.custid and accesslevel > 0 and prodForSale = True and ProductsPhotos.ID=cint(sfProducts.prodid) And sfCategories.CatID=sfProducts.prodCategoryId And prodforsale=True And prodSubCategoryId=" & prodSubCategoryId & " and sfProducts.custid= " & CustID & " ORDER BY prodName DESC;"

						'response.write (sql2)
						Set rs2 = Server.CreateObject("ADODB.Recordset")
						rs2.Open sql2, conn, 3, 3  
						'response.write("recordcount=" & rs2.recordcount)
						max=rs2.recordcount - 1
						min=1
                       
					    minprice = 0
						maxprice = 0
						imagecount = 0
						
						   If prodSubCategoryId > 0 Then
										sql3 = "SELECT distinct subcategoryname  FROM sfProducts, sfsubCategories WHERE sfProducts.prodSubCategoryId = sfsubCategories.SubCatID and  prodSubCategoryId=" & rs("prodSubCategoryId") 
'response.write(sql3)
										Set rs3 = Server.CreateObject("ADODB.Recordset")
										rs3.Open sql3, conn, 3, 3 
										If Not rs3.eof Then
											subcatname = rs3("subcategoryname")
										End if
										rs3.close
							Else
						      subcatname = ""
						   End If 
						   While Not rs2.eof 
							prodCategoryId = rs("prodCategoryId")
							imagecount  = imagecount  +1
							Imagearray(imagecount) = rs2("productImage1")
							'response.write("Image=" & Imagearray(imagecounter))
							currentprice = 	rs2("prodprice") 
							If currentprice < minprice Or   minprice = 0 Then
									minprice =currentprice
							End If 

						If currentprice > maxprice Or   maxprice = 0 Then
									maxprice =currentprice
							End If 

						rs2.movenext
						 wend 
						finalimagecount = imagecount
	

                        If rs2.recordcount > 1 then
							rs2.movefirst
						End If
						If finalimagecount < 2 then
							productImage1 =Imagearray(1) 
						Else
						Randomize
							randomnumber = int((finalimagecount -0+1)*rnd+0)
							productImage1 =Imagearray(randomnumber)

						End If 

						If  Len(productImage1) > 3 Then
							'productImage1 =rs2("productImage1")
						Else
							productImage1 = "imagenotavailable.jpg"
						End if
	If  Len(productImage1) > 3 Then
							'productImage1 =rs2("productImage1")
						Else
							productImage1 = "imagenotavailable.jpg"
						End If 
						 loopcounter = 0
						If productImage1 = "imagenotavailable.jpg" And finalimagecount > 1  then
							while productImage1 = "imagenotavailable.jpg" And loopcounter < 8
							 loopcounter = loopcounter  + 1
							'response.write("productImage1 =" & productImage1 )
								randomnumber = int((finalimagecount -0+1)*rnd+0)
								productImage1 =Imagearray(randomnumber)
								If  Len(productImage1) > 3 Then
									'productImage1 =rs2("productImage1")
								Else
									productImage1 = "imagenotavailable.jpg"
								End if
							Wend
						End If 

						 If rs2.recordcount = 1  Then
								  If Len(productImage1) < 30 Then 
							        Image = "/uploads/" & productImage1
								  Else
								   Image = productImage1
								End If 
						 End If

						 If rs2.recordcount > 1 Then
						Randomize
						my_num=int((max-min+1)*rnd+min)
						'Response.Write my_num
						For i = 0 To my_num - 1
								 rs2.movenext
						Next
						
						If Not rs2.eof Then
							If Len(productImage1) < 30 Then 
							        Image = "/uploads/" & productImage1
								  Else
								   Image = productImage1
								End If 

						End If 
						
						End If 
							
							
						%>
								 <a href = "RanchSubStore.asp?subcatID=<%=rs("prodSubCategoryId")%>&catID=<%=prodCategoryId %>&custID=<%=CustID%>" class = "small">
										<IMG alt="main image" border=0  src="<%= Image %>" align = "center" height = "100"><br>
										<div align = "left"><b><%=Trim(rs("CatName"))%></b><br>
										<% if len(subcatname) > 1 then %>
											<b><%=Trim(subcatname)%></b><br>
										<% End If %>
									<% If  minprice > 0  Then %>
											
											<font color = "#222222"><%= formatcurrency(minprice) %>
										<% If minprice < maxprice And minprice > 0 And maxprice > 0 Then %>
											- <%= FormatCurrency(maxprice) %>
										<% End If %>
										</font></a>
									<% End If %>	
										
										</b><br>
										<br><br><br>
										</div>
				  </td>
				             <%
								
							Imagearray(0) = "" 



							 rs.movenext  
							End If %>
				 <% Next %>
				 </tr>

		  </table>
          <%     
         Wend %>

