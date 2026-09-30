


<% bcounter = 0
         pictureside = "right"

	
	CPCounter = 0
	 While CPCounter < CategoryCount
			CPCounter  = CPCounter  +1
	
				'CategoryProdIDArray(CPCounter)
				'SubCategoryIDArray(CPCounter) 



			sql = "SELECT  * FROM sfProducts, sfsubCategories WHERE  sfProducts.prodId = '" & CategoryProdIDArray(CPCounter) & "' And cint(sfProducts.prodSubCategoryId)=cint(sfsubCategories.subcatCategoryId) ORDER BY sfProducts.prodSubCategoryId, ProdPrice DESC; " 
			response.write(sql)
     
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3 
			If rs.eof Then
				NewSubcategoryName = "No SubCategory"
				rs.close
					sql = "SELECT  * FROM sfProducts,WHERE  sfProducts.prodId = '" & CategoryProdIDArray(CPCounter) & "' order by sfProducts.prodCategoryId, ProdPrice DESC " 
					response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					rs.Open sql, conn, 3, 3   
			else
				NewSubcategoryID = rs("CategoryID")
			End If 

				If NewSubcategoryID > 1 then
					rs.close
					sql = "SELECT  * FROM sfProducts, sfsubcategories WHERE cint(sfProducts.prodCategoryId) = cint(sfSubCategories.CategoryID) and  sfProducts.prodId = '" & CategoryProdIDArray(CPCounter) & "' order by sfProducts.prodCategoryId, ProdPrice DESC " 
					response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					rs.Open sql, conn, 3, 3   

					NewSubcategoryID = rs("SubCatcategoryID")
					NewSubcategoryName =  rs("SubcategoryName")

					'response.write("NewSubcategoryName=") 
					'response.write(NewSubcategoryName) 

				End if
					
					'response.write("OldSubcategoryName=") 
					'response.write(OldSubcategoryName) 

		If Not(OldSubCategoryName = NewSubCategoryName)  Then 
			If NewSubCategoryName = "No SubCategory" then	%>
				<table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<H3>&nbsp;&nbsp;General <%=CategoryName%><br></H3>
						</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td colspan = "2"   height = "5"  ><img src = "images/px.gif". height = "2"></td>
					</tr>
				</table>
		<% Else %>
					<table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<H3>&nbsp;&nbsp;<%=NewSubCategoryName%><br></H3>
						</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td colspan = "2"   height = "5"  ><img src = "images/px.gif". height = "2"></td>
					</tr>
			</table>

	<%	End If 


	   ProdDescription = rs("ProdDescription")
		
		str1 = ProdDescription
		str2 = vblfvblf
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "</br>")
		End If  


		str1 = ProdDescription
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "</br>")
		End If  

		str1 = ProdDescription
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  


			counter = counter +1	
			If pictureside = "left" then
			    pictureside = "right"
		 Else
		     pictureside = "left" 
	    End if
		 %>          
         <table border = "0" width = "700"    leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >

          <% oldID = ID
                ID = rs("ProdID")
				while ID=  oldID 
					rs.movenext
					ID = rs("ProdID")
				
				'response.write( ID)
				wend
		 
		 
		ProdPrice= rs("ProdPrice")


				%> 
		<tr>
			<td>
			
	
		<table bgcolor = "white" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" border = "0">
			<tr> 
			<td class= "body"  valign = "top" align = "center" width = "500"><br>
				<!--#Include file="StoreProdInfoInclude.asp"--><br> 
			</td>
			<td align="center" width = "125"  class = "body" valign = "top"> <br>      
				<!--#Include file="ProductsDetailImageInclude.asp"--><br> 
			</td>
		  
		</tr>
		</table>
		   <br>


		

 <% OldSubCategoryName = NewSubCategoryName
             rs.movenext  %>
           
		  </table>
          <%   
		  End if
         Wend %>
        

  