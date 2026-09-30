



  

			
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  >
	<tr>
	     <td class = "body"  >	<br>	
		   <% If Len(Productsheading) > 1 Then %>
				<h1><%=Productsheading%></h1>
		   
		
			<% Else %>
					<h1><font color = "<%=TitleFontColor %>">Alpaca Products for Sale</font></h1>
			<% End if %>


		</td>
	</tr>
	<tr>
		<td  class = "body">
				<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"   ><tr>
		     	<td  class = "body">

			<%
			TempOrientation = ImageOrientation1
			TempImage = Image1
			TempImageCaption = ImageCaption1
			TempHeading = PageHeading1
			TempPageText = PageText1
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	


		
				<%	Dim 	CategoryIDArray(20000)	
					Dim 	CategoryNameArray(20000)	
						
						conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
							"Data Source=" & server.mappath(databasepath) & ";" & _
							"User Id=;Password=;" '& _ 
							' Get marketing text for the top of the page:
					sql = "SELECT DISTINCT sfCategories.CatName, sfCategories.CatID FROM sfCategories, sfproducts, sfcustomers WHERE sfcustomers.custid = sfproducts.custid and sfcustomers.accesslevel > 0 and sfproducts.prodcategoryid=catID  And Prodforsale=True and sfcustomers.custid = " & custid & "; "

					'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 
					SCounter =0
					While not rs.eof 
						SCounter = SCounter +1 
						
						CategoryIDArray(SCounter) = rs("CatID")
						CategoryNameArray(SCounter) = rs("CatName")
						'RESPONSE.WRITE("CategoryIDArray" & SCounter & "=" & CategoryIDArray(SCounter) & "</br>" )
					 rs.movenext
					Wend %>
							
					
					<% FinalCount = SCounter 
				
					Counter = 0
					While Counter < FinalCount
						Counter = Counter +1 %>
		
						<% sql = "SELECT distinct SubCategoryName, subcatID FROM sfProducts, sfsubcategories, sfcustomers WHERE sfcustomers.custid = sfproducts.custid and sfcustomers.accesslevel > 0 and cint(prodsubCategoryId)=cint(sfsubcategories.subcatID) And Prodforsale=True and  ProdcategoryID = " & CategoryIDArray(Counter)  & " order by SubCategoryName " 
						'response.write (sql)
						Set rs = Server.CreateObject("ADODB.Recordset")
						rs.Open sql, conn, 3, 3  
						show = True
					If show = True then
						%><a href = "Ranchstore.asp?custid=<%=custid%>;catID=<%=CategoryIDArray(Counter)%>" class = "menu2"><b><%=CategoryNameArray(Counter) %> |</b></a>&nbsp;<%
					End if
		Wend
		
		If show = True then%><a href = "Properties.asp" class = "menu2"><b>Ranches</b></a><br>
		<% end if %>
<br>



				<br><br>
		</td>
	</tr>
</table>

		</td>
	</tr>
</table>
